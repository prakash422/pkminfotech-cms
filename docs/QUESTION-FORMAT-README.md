# Question Format README

This file documents all supported formats for adding questions in the admin flow.

Use this with:
- Admin page: `Question Practice -> JSON Bulk Import (One Click)`
- API route: `POST /api/question-practice`

---

## 1) Single Question API Format

Use when adding one question at a time with `type: "question"`.

```json
{
  "type": "question",
  "data": {
    "questionText": "What is 12 + 8?",
    "questionTextHi": "12 + 8 kitna hota hai?",
    "optionA": "18",
    "optionAHi": "18",
    "optionB": "20",
    "optionBHi": "20",
    "optionC": "22",
    "optionCHi": "22",
    "optionD": "24",
    "optionDHi": "24",
    "correctAnswer": "B",
    "language": "bilingual",
    "explanation": "2 digits addition",
    "explanationHi": "2 ankon ka yog",
    "examId": "EXAM_ID",
    "practiceSetId": "SET_ID",
    "subjectId": "SUBJECT_ID",
    "topicId": "TOPIC_ID"
  }
}
```

Notes:
- `correctAnswer` must be `A | B | C | D`
- `language` supports `en | hi | bilingual`

---

## 2) Bulk Import (Flat Format)

Use when you have top-level exam/section and `options` as string array.

```json
{
  "type": "bulkImport",
  "data": {
    "exam": "SSC CGL",
    "section": "Reasoning",
    "questions": [
      {
        "question": "Book : Author :: Song : ?",
        "options": ["Singer", "Writer", "Composer", "Actor"],
        "correctAnswer": "Singer",
        "explanation": "Author writes book, singer sings song."
      }
    ]
  }
}
```

How mapping works:
- `question` -> `questionText`
- `options[0..3]` -> `optionA..optionD`
- `correctAnswer` can be option text (`Singer`) or option id (`A/B/C/D`)
- If exam/section does not exist, API auto-creates exam/subject

---

## 3) Bulk Import (Bilingual Nested Format) [Recommended]

Use this for best English + Hindi support.

```json
{
  "type": "bulkImport",
  "data": {
    "exam": "SSC CGL",
    "section": "Reasoning",
    "questions": [
      {
        "question": {
          "en": "Find the next number in the series: 3, 7, 15, 31, ?",
          "hi": "श्रृंखला में अगली संख्या ज्ञात करें: 3, 7, 15, 31, ?"
        },
        "options": [
          { "id": "A", "en": "47", "hi": "47" },
          { "id": "B", "en": "63", "hi": "63" },
          { "id": "C", "en": "62", "hi": "62" },
          { "id": "D", "en": "64", "hi": "64" }
        ],
        "correctOption": "B",
        "explanation": {
          "en": "Pattern: multiply by 2 and add 1.",
          "hi": "पैटर्न: प्रत्येक संख्या को 2 से गुणा करके 1 जोड़ें।"
        }
      }
    ]
  }
}
```

How mapping works:
- `question.en` -> `questionText`
- `question.hi` -> `questionTextHi`
- `options[].en/hi` -> `optionA..D` and `optionAHi..DHi`
- `correctOption` -> `correctAnswer`
- Language auto-detected as `bilingual` when Hindi content exists

---

## 4) Optional `set` Block in Bulk Import

If you want full control of set metadata, pass `set` block.

```json
{
  "type": "bulkImport",
  "data": {
    "set": {
      "title": "SSC CGL Reasoning Set 01",
      "examId": "EXAM_ID",
      "subjectId": "SUBJECT_ID",
      "language": "bilingual",
      "difficulty": "mixed",
      "totalQuestions": 10
    },
    "questions": []
  }
}
```

If `set.title` is not provided, title is auto-generated from `exam + section`.

---

## 5) Quick Rules

- Always provide 4 options (A, B, C, D)
- Keep `correctAnswer/correctOption` valid
- For bilingual data, prefer nested format (section 3)
- Use UTF-8 JSON when adding Hindi text
- Import from admin UI: paste JSON in `JSON Bulk Import (One Click)` and click `Import JSON`

---

## 6) Mock Test Format (Section + Question IDs)

Use this with:
- `POST /api/mock-tests`

```json
{
  "mockId": "ssc-cgl-mini-1",
  "exam": "SSC CGL",
  "totalQuestions": 20,
  "totalMarks": 40,
  "negativeMarking": 0.5,
  "durationMinutes": 20,
  "language": "bilingual",
  "sections": [
    {
      "name": "Reasoning",
      "questions": ["q1_id", "q2_id", "q3_id"]
    },
    {
      "name": "Quant",
      "questions": ["q11_id", "q12_id"]
    }
  ]
}
```

Notes:
- `mockId` must be unique (same `mockId` re-import updates existing test)
- `sections[].questions` must contain valid Question IDs from DB
- Exam auto-create is supported if exam name does not exist

---

## 7) Daily Quiz Format

Use this with:
- `POST /api/daily-quiz`

```json
{
  "quizId": "daily-quiz-2026-02-20",
  "title": "Daily Quiz - 20 Feb 2026",
  "date": "2026-02-20",
  "exam": "SSC CGL",
  "totalQuestions": 5,
  "durationMinutes": 5,
  "marksPerQuestion": 2,
  "negativeMarking": 0.5,
  "questions": [
    {
      "category": "Reasoning",
      "question": {
        "en": "Find next number: 2, 6, 12, 20, ?",
        "hi": "अगली संख्या ज्ञात करें: 2, 6, 12, 20, ?"
      },
      "options": [
        { "id": "A", "en": "28", "hi": "28" },
        { "id": "B", "en": "30", "hi": "30" },
        { "id": "C", "en": "32", "hi": "32" },
        { "id": "D", "en": "26", "hi": "26" }
      ],
      "correctOption": "B"
    }
  ]
}
```

Optional:
- You can pass `sections`/`questionIds` directly (ID mode) instead of inline `questions`.

Rules:
- `quizId` must be unique (re-import with same `quizId` updates record)
- At least one question must be provided (`questions[]` or `questionIds` or `sections[].questions`)
- For inline mode, API auto-creates question records and groups sections by `category`
- Ideal daily setup: 5 questions, mixed 5 sections, 5 minutes, instant result

