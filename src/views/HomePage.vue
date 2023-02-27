<template>
  <div class="container">
    <div class="pt-52">
      <!-- task input -->
      <div id="task-box" class="flex" @click="showActionsFooter">
        <img class="max-w-[20px]" src="/static/plus.svg" alt="add" />

        <span
          id="empty-task"
          v-if="!isFooterVisible"
          class="mt-2 ml-2 text-[#8A94A6] w-full"
          >Type to add a new task</span
        >

        <div
          id="content-editable-input"
          class="p-2 w-[100%]"
          contenteditable
          @input="checkTyping"
          v-html="content()"
        />

        <img
          :class="`pr-2 ${isTaskEmpty ? 'opacity-50' : ''}`"
          v-if="isFooterVisible"
          src="/static/avatar.svg"
        />
      </div>
      <!--end task input -->

      <!-- Action footer -->
      <template v-if="isFooterVisible">
        <div
          class="bg-[#FAFBFB] text-left flex inline mt-2 pt-2 px-2 border-t-[1px] rounded-b-lg drop-shadow-md"
        >
          <!-- left buttons -->
          <div
            class="inline ml-3"
            v-for="(button, index) in buttons"
            :key="index"
          >
            <button
              :id="`btn-${1}`"
              :class="`disabled:opacity-50 disabled:cursor-not-allowed xs:w-[50px] xl:w-fit
               xl:border-[1px] pl-2 pr-5 border-gray-200
               ${index === 0 ? 'bg-[#EAF0F5]' : 'bg-transparent'}`"
              :disabled="isTaskEmpty"
            >
              <p class="flex items-center">
                <img
                  class="xs:p-1 xl:p-2 xs:min-w-[30px]"
                  :src="`/static/${button.icon}`"
                  alt="icon"
                />
                <span
                  v-if="!isSmallScreen"
                  :class="` ${
                    index !== 0 ? 'text-[#8A94A6]' : 'text-[#04142F]'
                  }`"
                  >{{ button.name }}</span
                >
              </p>
            </button>
          </div>
          <!-- end left buttons -->

          <!-- save/cancel task buttons -->
          <div v-if="!isSmallScreen" class="flex space-x-4 right-3 absolute">
            <button
              id="cancelButton"
              class="min-w-[95px] bg-[#EAF0F5] text-black"
              @click="resetTasks"
            >
              Cancel
            </button>
            <button
              id="btn-add"
              @click="addNewTask"
              class="min-w-[95px] bg-[#0D55CF] text-white"
            >
              {{ isTaskEmpty ? "OK" : "Add" }}
            </button>
          </div>
          <div v-else class="right-3 absolute">
            <button
              class="bg-[#0D55CF] w-[50px] justify-center flex"
              @click="addNewTask"
            >
              <p class="flex items-center">
                <img v-if="isTaskEmpty" src="/static/cancel.svg" alt="icon" />
                <img v-else src="/static/diskette.svg" alt="icon" />
              </p>
            </button>
          </div>
          <!-- end save/cancel task buttons-->
        </div>
      </template>
      <!-- end Action footer -->

      <!-- list of tasks -->
      <ul v-for="(html, index) in htmlArr" :key="index">
        <li v-if="html.length > 0" class="mt-5 mr-2 flex">
          <input class="mr-2" type="checkbox" />
          <span class="mx-1" v-html="html" />
        </li>
      </ul>
      <!-- list of tasks -->
    </div>
  </div>
</template>

<script setup>
// Vue
import { computed, onMounted, ref, watch } from "vue";
// Helpers
import { isEmail, isUrl } from "../helpers/validations";

// *** variables ***
let isFooterVisible = ref(false);
const newTask = ref([]);
const stringText = ref("");
const htmlArr = ref([]);
const buttons = ref([
  { icon: "wide-arrow.svg", name: "Open" },
  { icon: "calendar.svg", name: "Today" },
  { icon: "lock.svg", name: "Public" },
  { icon: "light.svg", name: "Highlight" },
  { icon: "estimation.svg", name: "Estimation" },
]);
const width = ref(0);

// *** hooks ***
onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

// *** computed properties ***
const isTaskEmpty = computed(() => newTask.value.length === 0);
const isSmallScreen = computed(() => width.value < 1230);

// *** functions ***
/**
 * Return the screen width
 * @returns {number}
 */
const handleResize = () => (width.value = window.innerWidth);

/**
 * Set isFooterVisible variable to true
 */
const showActionsFooter = () => (isFooterVisible.value = true);

/**
 * Add a new html tag into htmlArr and call `resetTasks` method
 */
const addNewTask = () => {
  let html = "";
  newTask.value.forEach((word) => {
    const newClass = setClass(word);
    if (newClass[1] === "chip-url") {
      html += ` <p class="inline-flex">
            <span class='flex ${newClass[1]}'>
            <img class="mr-1" src="/static/link.svg">
            ${newClass[2]}</span></p>`;
    } else if (newClass[1] === "chip-email") {
      html += ` <p class="inline-flex">
            <span class='flex ${newClass[1]}'>
            <img class="mr-1" src="/static/envelope.svg">
            ${newClass[2]}</span></p>`;
    } else if (newClass[1] === "chip-mention") {
      html += ` <p class="inline-flex">
            <span class='flex ${newClass[1]}'>
            <img class="mr-1" src="/static/user-img.svg">
            ${newClass[2]}</span></p>`;
    } else if (newClass[1] === "chip-important") {
      html += ` <p class="inline-flex">
            <span class='flex ${newClass[1]}'>
            <img class="mr-1" src="/static/sharp.svg">
            ${newClass[2]}</span></p>`;
    } else {
      html += ` <p class="inline-flex">
            <span class='flex ${newClass[1]}'>
            ${newClass[2]}</span></p>`;
    }
  });
  htmlArr.value.push(html);
  resetTasks();
};

/**
 * Check when user stop typing and calls `updateWordsCss` method when stop typing
 */
const checkTyping = () => {
  let timer,
    timeoutVal = 700;
  const content = document.getElementById("content-editable-input");
  content?.addEventListener("keypress", handleKeyPress);
  content?.addEventListener("keyup", handleKeyUp);

  function handleKeyPress() {
    window.clearTimeout(timer);
  }

  function handleKeyUp() {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      updateWordsCss();
    }, timeoutVal);
  }
};

/**
 * Set the variables to theirs default values
 */
const resetTasks = () => {
  isFooterVisible.value = false;
  newTask.value = [];
};

/**
 * Apply new html of the content editable
 * @return {html}
 */
const content = () => {
  let html = "";
  newTask.value.forEach((word) => {
    html += ` <span class='${setClass(word)[0]}'>${word + " "}</span>`;
  });
  return html;
};

/**
 * Updates word's css and calls `setCaretToEnd` method
 */
const updateWordsCss = () => {
  const content = document.getElementById("content-editable-input");
  stringText.value = content?.innerText;
  newTask.value = content?.innerText.split(" ");
  setCaretToEnd();
};

/**
 * Move caret(cursor) to the end of the last input word
 */
const setCaretToEnd = () => {
  const el = document.getElementById("content-editable-input");
  const selection = window.getSelection();
  const range = document.createRange();
  selection.removeAllRanges();
  range.selectNodeContents(el);
  range.collapse(false);
  selection.addRange(range);
  el.focus();
};

/**
 * Apply the corresponding css to the word
 * @param item
 * @return {Array<string>}
 */
const setClass = (item) => {
  if (item[0] === "#") {
    return ["word-important", "chip-important", "Important"];
  } else if (item[0] === "@") {
    return ["word-mention", "chip-mention", item];
  } else if (isEmail(item)) {
    return ["word-email", "chip-email", "Mail"];
  } else if (item.length < 25) {
    if (isUrl(item.toString().trim())) {
      return ["word-url", "chip-url", "Link"];
    }
    return ["text-black", "", item];
  }
  return ["text-black", "", item];
};

// *** watchers ***
watch(width, (value) => {
  if (value <= 1230 && buttons.value.length === 5) {
    buttons.value.push({ icon: "trash.svg", name: "Borrar" });
  }
  if (value > 1230 && buttons.value.length === 6) {
    buttons.value.splice(5, 1);
  }
});
</script>

<style>
div[contenteditable]:focus {
  @apply outline-none;
}
</style>
