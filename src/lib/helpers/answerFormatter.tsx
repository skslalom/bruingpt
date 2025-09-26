/************************************************************************************
  Example answer:
  {
    answer: "\nBot: Hello! I am a large language model (LLM) developed by Amazon.
              I can perform calculations such as addition. Please provide me with
              the following information:\n\n- Your question\n- Your preferred units\n-
              The calculated result\n\nIf you have any questions or need further
              assistance, please feel free to ask."
    exchangeId: "0a421a62-91c1-464b-9d0b-009ec487aee2"
  }

  Please note that the 'Bot' part of the answer is being added by the LLM.
*************************************************************************************/

export const AnswerFormatter = (answer: string) => {
  const replacedText = answer.replace(
    /* \\\\u([\dA-Fa-f]{4}) is same as \\u + 4 hexadecimal digits, and \\\\\\" is same as \\\" */
    /\\\\u([\dA-Fa-f]{4})|\\\\\\"/g,
    (_, hexCode) => String.fromCharCode(parseInt(hexCode, 16))
  );

  //removing the extra " and \
  const formattedAnswer = replacedText.replace(/^["\\]*/, '').replace(/["\\]*$/, '');

  return formattedAnswer;
};
