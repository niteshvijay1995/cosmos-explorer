import { Text } from "@fluentui/react";
import { shallow } from "enzyme";
import { useQueryCopilot } from "hooks/useQueryCopilot";
import React from "react";
import { ExplanationBubble } from "./ExplanationBubble";

describe("Explanation Bubble", () => {
  const initialStoreState = useQueryCopilot.getState();
  beforeEach(() => {
    useQueryCopilot.setState(initialStoreState, true);
    useQueryCopilot.getState().showExplanationBubble = true;
    useQueryCopilot.getState().shouldIncludeInMessages = false;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("should render explanation bubble with generated comments", () => {
    useQueryCopilot.getState().showQueryExplanation = true;
    useQueryCopilot.getState().shouldIncludeInMessages = true;

    const wrapper = shallow(<ExplanationBubble />);

    expect(wrapper.find("Stack")).toHaveLength(1);
    expect(wrapper.find("Text")).toHaveLength(0);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render 'Explain this query' link", () => {
    const mockSetChatMessages = jest.fn();
    const mockSetIsGeneratingExplanation = jest.fn();
    const mockSetShouldIncludeInMessages = jest.fn();
    const mockSetShowQueryExplanation = jest.fn();
    useQueryCopilot.getState().setChatMessages = mockSetChatMessages;
    useQueryCopilot.getState().setIsGeneratingExplanation = mockSetIsGeneratingExplanation;
    useQueryCopilot.getState().setShouldIncludeInMessages = mockSetShouldIncludeInMessages;
    useQueryCopilot.getState().setShowQueryExplanation = mockSetShowQueryExplanation;

    const wrapper = shallow(<ExplanationBubble />);

    const textElement = wrapper.find(Text);
    textElement.simulate("click");

    expect(mockSetChatMessages).toHaveBeenCalledWith([
      ...initialStoreState.chatMessages,
      { source: 0, message: "Explain this query to me" },
    ]);
    expect(mockSetIsGeneratingExplanation).toHaveBeenCalledWith(true);
    expect(mockSetShouldIncludeInMessages).toHaveBeenCalledWith(true);
    expect(mockSetShowQueryExplanation).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    expect(mockSetIsGeneratingExplanation).toHaveBeenCalledWith(false);
    expect(mockSetShowQueryExplanation).toHaveBeenCalledWith(true);
  });

  it("should render nothing when conditions are not met", () => {
    useQueryCopilot.getState().showExplanationBubble = false;

    const wrapper = shallow(<ExplanationBubble />);

    expect(wrapper.isEmptyRender()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });
});