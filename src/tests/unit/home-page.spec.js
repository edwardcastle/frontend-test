import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import HomePage from "../../views/HomePage.vue";

describe("HomePage", () => {
  let wrapper = null;
  beforeEach(() => {
    wrapper = mount(HomePage);
  });

  it("should set isFooterVisible to true when task box is clicked", () => {
    wrapper.find("#task-box").trigger("click");
    expect(wrapper.vm.isFooterVisible).toBe(true);
  });

  it("should display message when the footer is not visible", () => {
    const text = wrapper.find("#empty-task").text();
    expect(text).toBe("Type to add a new task");
  });

  it("should call resize window width method", () => {
    const resizeFunction = vi.spyOn(wrapper.vm, "handleResize");
    wrapper.vm.handleResize();
    expect(resizeFunction).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.width).greaterThan(0);
  });

  it("should set isFooterVisible to true when method is called", () => {
    wrapper.vm.showActionsFooter();
    expect(wrapper.vm.isFooterVisible).toBe(true);
  });

  it("should return the accurate array class given the word", () => {
    let result = "";

    // given a word that starts with #
    let word = "#ujansdjf";
    result = wrapper.vm.setClass(word);
    expect(result).toEqual(["word-important", "chip-important", "#Important"]);

    // given a word that starts with @
    word = "@edwardcastle";
    result = wrapper.vm.setClass(word);
    expect(result).toEqual(["word-mention", "chip-mention", "@edwardcastle"]);

    // given an email
    word = "sir.edwardcastle@gmail.com";
    result = wrapper.vm.setClass(word);
    expect(result).toEqual(["word-email", "chip-email", "Mail"]);

    // given an url
    word = "example.com";
    result = wrapper.vm.setClass(word);
    expect(result).toEqual(["word-url", "chip-url", "Link"]);

    // given a too long url
    word = "examplejhsadbfjhasdbfjhabsjhbadsjhfb.com";
    result = wrapper.vm.setClass(word);
    expect(result).toEqual([
      "text-black",
      "",
      "examplejhsadbfjhasdbfjhabsjhbadsjhfb.com",
    ]);

    // given a normal word
    word = "computer";
    result = wrapper.vm.setClass(word);
    expect(result).toEqual(["text-black", "", "computer"]);
  });

  it("test if the newTask array is empty", () => {
    expect(wrapper.vm.isTaskEmpty).toBe(true);
  });

  it("test is a small screen device", () => {
    expect(wrapper.vm.isSmallScreen).toBe(true);
  });
});
