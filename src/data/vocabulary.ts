export interface VocabularyEntry {
  simplified: string;
  traditional: string;
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
    { simplified: "你", traditional: "你" },
    { simplified: "我", traditional: "我" },
    { simplified: "他", traditional: "他" },
    { simplified: "她", traditional: "她" },
    { simplified: "姐", traditional: "姐" },
    { simplified: "妹", traditional: "妹" },
    { simplified: "哥", traditional: "哥" },
    { simplified: "弟", traditional: "弟" },
    { simplified: "家", traditional: "家" },
    { simplified: "人", traditional: "人" },
    { simplified: "朋", traditional: "朋" },
    { simplified: "友", traditional: "友" },
    { simplified: "老", traditional: "老" },
    { simplified: "师", traditional: "師" },
    { simplified: "名", traditional: "名" },
    { simplified: "字", traditional: "字" },
    { simplified: "谁", traditional: "誰" },
    { simplified: "白", traditional: "白" },
    { simplified: "红", traditional: "紅" },
    { simplified: "黑", traditional: "黑" },
    { simplified: "可", traditional: "可" },
    { simplified: "色", traditional: "色" },
    { simplified: "点", traditional: "點" },
    { simplified: "分", traditional: "分" },
    { simplified: "跟", traditional: "跟" },
    { simplified: "说", traditional: "說" },
    { simplified: "喜", traditional: "喜" },
    { simplified: "欢", traditional: "歡" },
    { simplified: "爱", traditional: "愛" },
    { simplified: "叫", traditional: "叫" },
    { simplified: "去", traditional: "去" },
    { simplified: "来", traditional: "來" },
    { simplified: "现", traditional: "現" },
    { simplified: "怎", traditional: "怎" },
    { simplified: "都", traditional: "都" },
    { simplified: "几", traditional: "幾" },
    { simplified: "好", traditional: "好" },
    { simplified: "了", traditional: "瞭" },
    { simplified: "吗", traditional: "嗎" },
    { simplified: "是", traditional: "是" },
    { simplified: "什", traditional: "什" },
    { simplified: "么", traditional: "麼" },
    { simplified: "个", traditional: "個" },
    { simplified: "岁", traditional: "歲" },
    { simplified: "和", traditional: "和" },
    { simplified: "多", traditional: "多" },
    { simplified: "少", traditional: "少" },
    { simplified: "班", traditional: "班" },
    { simplified: "谢", traditional: "謝" },
    { simplified: "做", traditional: "做" },
  ],
};

export const demoList: VocabularyList = {
  id: "demo",
  name: "Demo words",
  description: "A ready-to-play random practice set",
  entries: [
    { simplified: "苹果", traditional: "蘋果" },
    { simplified: "香蕉", traditional: "香蕉" },
    { simplified: "西瓜", traditional: "西瓜" },
    { simplified: "草莓", traditional: "草莓" },
    { simplified: "橙子", traditional: "橙子" },
    { simplified: "葡萄", traditional: "葡萄" },
    { simplified: "桃子", traditional: "桃子" },
    { simplified: "柠檬", traditional: "檸檬" },
    { simplified: "菠萝", traditional: "菠蘿" },
    { simplified: "芒果", traditional: "芒果" },
    { simplified: "樱桃", traditional: "櫻桃" },
    { simplified: "梨子", traditional: "梨子" },
  ],
};

export const vocabularyLists = [weeklyList, demoList] as const;
