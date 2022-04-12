import React, { useState } from "react";
import { TextInput, Select, Code, Tooltip, Button } from "@mantine/core";
import { useScrollLock } from "@mantine/hooks";
var pos = require("pos");
import styles from "../styles/Stress.module.css";

const Word = ({ text, active = false, tag = null }) => {
  const [selected, setSelected] = useScrollLock(active);
  const color = selected ? "teal" : "gray";
  if (tag) {
    return (
      <Tooltip label={tag}>
        <Button onClick={() => setSelected((c) => !c)} mx={3} color={color}>
          {text}
        </Button>
      </Tooltip>
    );
  }
  return (
    <Button onClick={() => setSelected((c) => !c)} mx={3} color={color}>
      {text}
    </Button>
  );
};

const SentenceToWords = ({ sentence, tags, posType }) => {
  console.log({ sentence });
  return (
    <div>
      {sentence
        ? sentence.map((w, id) => (
            <Word
              text={w}
              key={id}
              active={tags ? tags[id] : false}
              tag={posType ? posType[id] : false}
            ></Word>
          ))
        : none}
    </div>
  );
};

let tagger = new pos.Tagger();

const getTag = (word) => {
  let words = new pos.Lexer().lex(word);
  let taggedWord = tagger.tag(words);
  return taggedWord;
};

const isStessWord = (word) => {
  // tag that required stress
  const stesssTag = [
    "NN",
    "NNP",
    "NNS",
    "NNPS",
    "JJ",
    "JJR",
    "JJS",
    "VB",
    "VBG",
    "CD",
    "RB",
    "RBR",
    "RBS",
  ];
  const excludeCommonVBD = ["had", "was"];
  const tag = word ? getTag(word)[0][1] : null;
  if (tag === "VBD") {
    console.log(tag);
    return !excludeCommonVBD.includes(word);
  } else {
    return stesssTag.includes(tag);
  }
};

const WordTagging = ({ sentence }) => {
  const wordArray = sentence.split(" ");
  const tags = wordArray.map((w) => isStessWord(w));
  const posType = wordArray.map((w) => (w ? getTag(w)[0][1] : null));
  console.log({ wordArray });
  return (
    <SentenceToWords
      sentence={wordArray}
      tags={tags}
      posType={posType}
    ></SentenceToWords>
  );
};

const StressWordApp = () => {
  const texts = [
    "They've been learning English for two months.",
    "My friends have nothing to do this weekend.",
    "I would have visited in April if I had known Peter was in town.",
    "Natalie will have been studying for four hours by six o'clock.",
    "The boys and I will spend the weekend next to the lake fishing for trout.",
    "Jennifer and Alice had finished the report before it was due last week.",
  ];
  const [text, setText] = useState(texts[0]);
  const [inputText, setInputText] = useState(texts[1]);

  return (
    <div className={styles.Warpper}>
      <Select
        label="Select a sentence"
        placeholder="Pick one"
        value={text}
        onChange={setText}
        data={texts.map((sen) => ({ value: sen, label: sen }))}
      />
      <WordTagging sentence={text ? text : "NA"}></WordTagging>
      <br></br>
      <TextInput
        label="Or type/paste your own sentence"
        value={inputText}
        onChange={(event) => setInputText(event.currentTarget.value)}
      />
      <WordTagging sentence={inputText ? inputText : "NA"}></WordTagging>
      <Code></Code>
    </div>
  );
};
export default StressWordApp;
