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
    { simplified: "学校", traditional: "學校" },
    { simplified: "老师", traditional: "老師" },
    { simplified: "学生", traditional: "學生" },
    { simplified: "朋友", traditional: "朋友" },
    { simplified: "家庭", traditional: "家庭" },
    { simplified: "作业", traditional: "作業" },
    { simplified: "书包", traditional: "書包" },
    { simplified: "铅笔", traditional: "鉛筆" },
    { simplified: "桌子", traditional: "桌子" },
    { simplified: "椅子", traditional: "椅子" },
    { simplified: "早上", traditional: "早上" },
    { simplified: "晚上", traditional: "晚上" },
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
