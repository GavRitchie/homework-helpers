export interface VocabularyEntry {
  simplified: string;
  traditional: string;
  english?: string;
}

export interface VocabularyList {
  id: string;
  name: string;
  description: string;
  entries: VocabularyEntry[];
}

/**
 * Replace these entries with this week's words from the teacher.
 * Keep at least 10 unique entries. If a word is written the same way in both
 * systems, use the same characters for `simplified` and `traditional`.
 */
export const weeklyList: VocabularyList = {
  id: "weekly",
  name: "This week's words",
  description: "The current list from the teacher",
  entries: [
    // { simplified: "你", traditional: "你", english: "you" },
    // { simplified: "我", traditional: "我", english: "I / me" },
    // { simplified: "他", traditional: "他", english: "he / him" },
    // { simplified: "她", traditional: "她", english: "she / her" },
    // { simplified: "姐", traditional: "姐", english: "older sister" },
    // { simplified: "妹", traditional: "妹", english: "younger sister" },
    // { simplified: "哥", traditional: "哥", english: "older brother" },
    // { simplified: "弟", traditional: "弟", english: "younger brother" },
    // { simplified: "家", traditional: "家", english: "home / family" },
    // { simplified: "人", traditional: "人", english: "person" },
    // { simplified: "朋", traditional: "朋", english: "friend" },
    // { simplified: "友", traditional: "友", english: "friend" },
    // { simplified: "老", traditional: "老", english: "old" },
    // { simplified: "师", traditional: "師", english: "teacher" },
    // { simplified: "名", traditional: "名", english: "name" },
    // { simplified: "字", traditional: "字", english: "character / word" },
    // { simplified: "谁", traditional: "誰", english: "who" },
    // { simplified: "白", traditional: "白", english: "white" },
    // { simplified: "红", traditional: "紅", english: "red" },
    // { simplified: "黑", traditional: "黑", english: "black" },
    // { simplified: "可", traditional: "可", english: "can / may" },
    // { simplified: "色", traditional: "色", english: "color" },
    // { simplified: "点", traditional: "點", english: "dot / o'clock" },
    // { simplified: "分", traditional: "分", english: "minute / point" },
    // { simplified: "跟", traditional: "跟", english: "with / follow" },
    // { simplified: "说", traditional: "說", english: "speak / say" },
    // { simplified: "喜", traditional: "喜", english: "like" },
    // { simplified: "欢", traditional: "歡", english: "like" },
    // { simplified: "爱", traditional: "愛", english: "love" },
    // { simplified: "叫", traditional: "叫", english: "to be called" },
    // { simplified: "去", traditional: "去", english: "go" },
    // { simplified: "来", traditional: "來", english: "come" },
    // { simplified: "现", traditional: "現", english: "now" },
    // { simplified: "怎", traditional: "怎", english: "how" },
    // { simplified: "都", traditional: "都", english: "all / both" },
    // { simplified: "几", traditional: "幾", english: "how many" },
    // { simplified: "好", traditional: "好", english: "good" },
    // { simplified: "了", traditional: "瞭", english: "(completed action)" },
    // { simplified: "吗", traditional: "嗎", english: "(question particle)" },
    // { simplified: "是", traditional: "是", english: "is / am / are" },
    // { simplified: "什", traditional: "什", english: "what" },
    // { simplified: "么", traditional: "麼", english: "what" },
    // { simplified: "个", traditional: "個", english: "(measure word)" },
    // { simplified: "岁", traditional: "歲", english: "years old" },
    // { simplified: "和", traditional: "和", english: "and" },
    // { simplified: "多", traditional: "多", english: "many / much" },
    // { simplified: "少", traditional: "少", english: "few / little" },
    // { simplified: "班", traditional: "班", english: "class" },
    // { simplified: "谢", traditional: "謝", english: "thanks" },
    // { simplified: "做", traditional: "做", english: "do / make" },
    { simplified: "学", traditional: "學", english: "study / learn" },
    { simplified: "的", traditional: "的", english: "(possessive 's)" },
    { simplified: "们", traditional: "們", english: "(plural marker)" },
    { simplified: "生", traditional: "生", english: "born / life" },
    { simplified: "年", traditional: "年", english: "year" },
    { simplified: "号", traditional: "號", english: "date / number" },
    { simplified: "明", traditional: "明", english: "bright / tomorrow" },
    { simplified: "今", traditional: "今", english: "today" },
    { simplified: "昨", traditional: "昨", english: "yesterday" },
    { simplified: "后", traditional: "後", english: "after / behind" },
    { simplified: "天", traditional: "天", english: "day / sky" },
    { simplified: "前", traditional: "前", english: "before / front" },
    { simplified: "月", traditional: "月", english: "month / moon" },
    { simplified: "日", traditional: "日", english: "day / sun" },
    { simplified: "期", traditional: "期", english: "period / date" },
    { simplified: "星", traditional: "星", english: "star" },
    { simplified: "七", traditional: "七", english: "seven" },
    { simplified: "六", traditional: "六", english: "six" },
    { simplified: "八", traditional: "八", english: "eight" },
    { simplified: "九", traditional: "九", english: "nine" }
  ],
};

export const demoList: VocabularyList = {
  id: "demo",
  name: "Demo words",
  description: "A ready-to-play random practice set",
  entries: [
    { simplified: "苹果", traditional: "蘋果", english: "apple" },
    { simplified: "香蕉", traditional: "香蕉", english: "banana" },
    { simplified: "西瓜", traditional: "西瓜", english: "watermelon" },
    { simplified: "草莓", traditional: "草莓", english: "strawberry" },
    { simplified: "橙子", traditional: "橙子", english: "orange" },
    { simplified: "葡萄", traditional: "葡萄", english: "grape" },
    { simplified: "桃子", traditional: "桃子", english: "peach" },
    { simplified: "柠檬", traditional: "檸檬", english: "lemon" },
    { simplified: "菠萝", traditional: "菠蘿", english: "pineapple" },
    { simplified: "芒果", traditional: "芒果", english: "mango" },
    { simplified: "樱桃", traditional: "櫻桃", english: "cherry" },
    { simplified: "梨子", traditional: "梨子", english: "pear" },
  ],
};

export const vocabularyLists = [weeklyList, demoList] as const;
