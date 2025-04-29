<template>
  <div class="edit-container">
    <div class="settings-form">
      <a-form layout="vertical">
        <div class="form-section">
          <a-form-item
            :label="$t('timerSettings.title')"
            :validate-status="data.titleError ? 'error' : ''"
            :help="data.titleError"
          >
            <a-input
              v-model:value="data.title"
              :placeholder="$t('timerSettings.title')"
              @change="autoSave"
            />
          </a-form-item>
          <a-form-item
            :label="$t('timerSettings.timeLimit')"
            class="form-field"
          >
            <a-space>
              <a-input-number
                v-model:value="data.hours"
                :min="0"
                :max="23"
                addon-after="h"
                class="time-input"
                @change="autoSave"
              />
              <a-input-number
                v-model:value="data.minutes"
                :min="0"
                :max="59"
                addon-after="m"
                class="time-input"
                @change="autoSave"
              />
              <a-input-number
                v-model:value="data.seconds"
                :min="0"
                :max="59"
                addon-after="s"
                class="time-input"
                @change="autoSave"
              />
            </a-space>
          </a-form-item>
        </div>

        <div class="advanced-toggle">
          <a-button type="link" @click="data.showAdvanced = !data.showAdvanced">
            {{ data.showAdvanced ? $t('timerSettings.hideAdvanced') : $t('timerSettings.showAdvanced') }}
          </a-button>
        </div>

        <div v-if="data.showAdvanced" class="form-section advanced-section">
          <a-form-item
            :label="$t('timerSettings.clockStyle')"
            class="form-field"
          >
            <a-radio-group
              v-model:value="data.selectedStyle"
              button-style="solid"
              class="style-selection"
              @change="autoSave"
            >
              <a-radio-button
                v-for="style in clockStyles"
                :key="style.value"
                :value="style.value"
              >
                {{ style.label }}
              </a-radio-button>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            :label="$t('timerSettings.timerMode')"
            class="form-field"
          >
            <a-radio-group
              v-model:value="data.selectedMode"
              button-style="solid"
              class="mode-selection"
              @change="autoSave"
            >
              <a-radio-button :value="TIMER_MODES.COUNT_DOWN">{{
                $t("timer.countdown")
              }}</a-radio-button>
              <a-radio-button :value="TIMER_MODES.STOPWATCH">{{
                $t("timer.stopwatch")
              }}</a-radio-button>
            </a-radio-group>
          </a-form-item>

          <div class="inline-form-item">
            <label>{{ $t("timerSettings.soundAlert") }}</label>
            <div class="control-wrapper">
              <a-switch v-model:value="data.settings.soundAlert" @change="autoSave" />
            </div>
          </div>
          <div class="inline-form-item">
            <label>{{ $t("timerSettings.visualAlert") }}</label>
            <div class="control-wrapper">
              <a-switch v-model:value="data.settings.visualAlert" @change="autoSave" />
            </div>
          </div>
          <div class="inline-form-item">
            <label>{{ $t("timerSettings.warningTime") }}</label>
            <div class="control-wrapper">
              <a-input-number
                v-model:value="data.settings.warningThreshold"
                :min="1"
                :max="60"
                addon-after="seconds"
                class="warning-input"
                @change="autoSave"
              />
            </div>
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TIMER_STYLES, TIMER_MODES } from "../constants";
import { useI18n } from "vue-i18n";
import { API_BASE_URL } from "../config";
import mqtt from "mqtt";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const presentationId = route.query.presentationId;
const slideId = route.query.slideId;

const data = reactive({
  title: "",
  titleError: "",
  hours: 0,
  minutes: 0,
  seconds: 15,
  selectedStyle: TIMER_STYLES.FLIP_CLOCK,
  selectedMode: TIMER_MODES.COUNT_DOWN,
  settings: {
    soundAlert: true,
    visualAlert: true,
    warningThreshold: 10,
  },
  showAdvanced: false,
});


const clockStyles = [
  { label: t("timerSettings.digital"), value: TIMER_STYLES.DIGITAL },
  { label: t("timerSettings.icon"), value: TIMER_STYLES.ICON },
  { label: t("timerSettings.flipClock"), value: TIMER_STYLES.FLIP_CLOCK },
];

const mqttClient = mqtt.connect("wss://broker.emqx.io:8084/mqtt");


function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

onMounted(() => {
  const savedSettings = JSON.parse(
    localStorage.getItem(`timer_${presentationId}_${slideId}`)
  );
  if (savedSettings) {
    data.title = savedSettings.title || "";
    data.hours = savedSettings.hours;
    data.minutes = savedSettings.minutes;
    data.seconds = savedSettings.seconds;
    data.selectedStyle = savedSettings.style;
    data.selectedMode = savedSettings.mode || TIMER_MODES.COUNT_DOWN;
    data.settings = savedSettings.settings || data.settings;
  }
});

const saveSettings = async () => {
  data.titleError = "";
  if (!data.title.trim()) {
    data.titleError = t("timerSettings.title") + " is required";
    return;
  }
  const settingsToSave = {
    presentationId,
    slideId,
    title: data.title,
    hours: data.hours,
    minutes: data.minutes,
    seconds: data.seconds,
    style: data.selectedStyle,
    mode: data.selectedMode,
    settings: data.settings,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settingsToSave),
    });

    if (!response.ok) {
      throw new Error("Failed to save settings");
    }

    // Publish MQTT message to notify others
    mqttClient.publish(
      `timer/${presentationId}/${slideId}/settings`,
      JSON.stringify({ updated: true })
    );

    // Save to localStorage
    localStorage.setItem(
      `timer_${presentationId}_${slideId}`,
      JSON.stringify(settingsToSave)
    );

    return response.json();
  } catch (error) {
    console.error("Error saving settings:", error);
    // You might want to show an error message to the user here
  }
};

const debouncedSave = debounce(saveSettings, 500);

function autoSave() {
  debouncedSave();
}
</script>

<style scoped>
.edit-container {
  width: 383px;
  margin: 0 auto;
  padding: 0;
  background-color: #fff;
}

.settings-form {
  padding: 16px;
}

.form-section {
  padding-bottom: 16px;
}

.form-section:last-child {
  border-bottom: none;
}

.section-title {
  margin-top: 0 !important;
  margin-bottom: 16px !important;
  font-weight: 500 !important;
}

.form-field {
  margin-bottom: 16px;
}

/* Target only the label elements within form items */
.form-field :deep(.ant-form-item-label > label) {
  font-weight: 600;
}

.form-field:last-child {
  margin-bottom: 0;
}

.time-input {
  width: 100px !important;
}

.warning-input {
  width: 150px !important;
}

.style-selection,
.mode-selection {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.style-selection :deep(.ant-radio-button-wrapper),
.mode-selection :deep(.ant-radio-button-wrapper) {
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 4px !important;
}

.style-selection :deep(.ant-radio-button-wrapper:before) {
  display: none;
}

.action-section {
  margin-top: 24px;
}

.save-button {
  height: 40px;
  font-weight: 500;
  border-radius: 4px;
}

/* CSS for inline form layout */
.inline-form-fields {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.inline-form-fields .form-field {
  margin-bottom: 0;
  flex: 1;
}

/* CSS for form items on a single line */
.single-line-form {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.single-line-form .form-field {
  margin-bottom: 0;
  flex-grow: 1;
}

.single-line-form .form-field:last-child {
  flex-grow: 2;
}

.single-line-form :deep(.ant-form-item-label) {
  white-space: nowrap;
}

/* CSS for inline form items */
.inline-form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.inline-form-item label {
  font-weight: 600;
}

.form-header {
  padding: 16px 16px 0 16px;
}

.advanced-toggle {
  text-align: right;
  margin: 0 0 8px 0;
}

.advanced-section {
  border-radius: 6px;
  margin-bottom: 16px;
}
</style>
