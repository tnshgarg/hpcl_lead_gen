# Web Intelligence Layer - API Test Report

**Generated:** 2026-02-07T18:51:46.467Z
**Total Duration:** 35.51s
**Results:** ✅ 16 Passed | ❌ 0 Failed | ⏭️ 0 Skipped

---

## Test Summary

| # | Test Name | Status | Duration |
|---|-----------|--------|----------|
| 1 | Health Check | ✅ PASS | 117ms |
| 2 | Get Initial Dossiers | ✅ PASS | 47ms |
| 3 | Submit URL | ✅ PASS | 23ms |
| 4 | Poll Dossiers (attempt 1) | ✅ PASS | 4ms |
| 5 | Poll Dossiers (attempt 2) | ✅ PASS | 15ms |
| 6 | Poll Dossiers (attempt 3) | ✅ PASS | 69ms |
| 7 | Poll Dossiers (attempt 4) | ✅ PASS | 15ms |
| 8 | Poll Dossiers (attempt 5) | ✅ PASS | 12ms |
| 9 | Poll Dossiers (attempt 6) | ✅ PASS | 8ms |
| 10 | Poll Dossiers (attempt 7) | ✅ PASS | 11ms |
| 11 | Poll Dossiers (attempt 8) | ✅ PASS | 12ms |
| 12 | Dossier Generation | ✅ PASS | 35151ms |
| 13 | Get Dossier Details | ✅ PASS | 70ms |
| 14 | Submit Feedback | ✅ PASS | 41ms |
| 15 | Search Documents | ✅ PASS | 55ms |
| 16 | Get Leads | ✅ PASS | 5ms |

---

## Detailed Results

### 1. Health Check

**Status:** ✅ PASS
**Duration:** 117ms

#### Request
```
GET http://localhost:3000/api/v1/health
```

#### Response (Status: 200)
```json
{
  "status": "healthy",
  "timestamp": "2026-02-07T18:51:11.063Z",
  "version": "1.0.0",
  "uptime": 8072,
  "components": [
    {
      "name": "postgresql",
      "healthy": true,
      "latencyMs": 46
    },
    {
      "name": "redis",
      "healthy": true,
      "latencyMs": 5
    },
    {
      "name": "qdrant",
      "healthy": {
        "healthy": true
      },
      "latencyMs": 28,
      "details": {
        "vectorCount": 5,
        "dimension": 384,
        "indexedPercentage": 100
      }
    }
  ]
}
```

---

### 2. Get Initial Dossiers

**Status:** ✅ PASS
**Duration:** 47ms

#### Request
```
GET http://localhost:3000/api/v1/dossiers?limit=100
```

#### Response (Status: 200)
```json
{
  "dossiers": [
    {
      "id": "365d5861-548d-4273-9c87-ea330c749df8",
      "leadId": "0cbb2e77-36c4-4f3d-89ef-c5408899b27e",
      "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T17:25:58.057Z",
            "sourceUrl": "https://httpbin.org/anything?t=1770485144640&unique=9o2ltd",
            "confidence": 0.2,
            "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
            "primaryIntent": "research"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "research",
                "context": "Matched keywords: data",
                "confidence": 0.2
              }
            ],
            "summary": "{\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
            "entities": [],
            "sentiment": {
              "neutral": 0.34,
              "negative": 0.33,
              "positive": 0.33
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999948940972221,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.06,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.34999948940972225,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 4,
            "documents": [
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.8676573
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.8676573
              },
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.8676573
              },
              {
                "id": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
                "similarity": 0.81019807
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/anything?t=1770485144640&unique=9o2ltd scored 35% (review_needed). Primary intent: research. {\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T17:26:06.217Z",
      "version": "1.0"
    },
    {
      "id": "1ddd888f-e4e9-4fbd-8031-f7d7e3409ffd",
      "leadId": "0061acfd-d1ac-4568-b1ab-cdd9035f4be3",
      "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:52:40.358Z",
            "sourceUrl": "https://httpbin.org/html?t=1770479553092",
            "confidence": 0.4,
            "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
            "primaryIntent": "support"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "support",
                "context": "Matched keywords: issue, question",
                "confidence": 0.4
              }
            ],
            "summary": "Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999994809027778,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.12,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.40999994809027773,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 3,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.83062285
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.83062285
              },
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.83062285
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/html?t=1770479553092 scored 41% (review_needed). Primary intent: support. Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:52:40.361Z",
      "version": "1.0"
    },
    {
      "id": "d631d42d-a599-4ce3-aa86-9e51be8356bc",
      "leadId": "7fedac29-4da2-4f6a-9e13-89c84e64809b",
      "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:19.245Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182",
            "confidence": 0.8,
            "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999992893518518,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299999289351852,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 2,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:19.245Z",
      "version": "1.0"
    },
    {
      "id": "3f16a0db-53ac-406c-9ddc-700cfde0e4c4",
      "leadId": "1c048793-7e4a-45f0-9a4f-c29e63facdcc",
      "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:00.752Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275",
            "confidence": 0.8,
            "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499998761574074,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299998761574074,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 1,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:00.752Z",
      "version": "1.0"
    },
    {
      "id": "221befff-51d9-490f-bc7a-2bdca5adf5a0",
      "leadId": "914cafe4-7188-4667-992a-4dd8adc1b985",
      "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:47:26.584Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882",
            "confidence": 0.8,
            "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, price, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499854453125,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299854453125,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:47:26.584Z",
      "version": "1.0"
    }
  ],
  "count": 5
}
```

---

### 3. Submit URL

**Status:** ✅ PASS
**Duration:** 23ms

#### Request
```
POST http://localhost:3000/api/v1/urls
```
**Body:**
```json
{
  "url": "https://httpbin.org/anything?t=1770490271120&unique=ydb0n5",
  "priority": 10,
  "sourceType": "html"
}
```

#### Response (Status: 202)
```json
{
  "jobId": "4",
  "url": "https://httpbin.org/anything?t=1770490271120&unique=ydb0n5"
}
```

---

### 4. Poll Dossiers (attempt 1)

**Status:** ✅ PASS
**Duration:** 4ms

#### Request
```
GET http://localhost:3000/api/v1/dossiers?limit=100
```

#### Response (Status: 200)
```json
{
  "dossiers": [
    {
      "id": "365d5861-548d-4273-9c87-ea330c749df8",
      "leadId": "0cbb2e77-36c4-4f3d-89ef-c5408899b27e",
      "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T17:25:58.057Z",
            "sourceUrl": "https://httpbin.org/anything?t=1770485144640&unique=9o2ltd",
            "confidence": 0.2,
            "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
            "primaryIntent": "research"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "research",
                "context": "Matched keywords: data",
                "confidence": 0.2
              }
            ],
            "summary": "{\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
            "entities": [],
            "sentiment": {
              "neutral": 0.34,
              "negative": 0.33,
              "positive": 0.33
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999948940972221,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.06,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.34999948940972225,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 4,
            "documents": [
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.8676573
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.8676573
              },
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.8676573
              },
              {
                "id": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
                "similarity": 0.81019807
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/anything?t=1770485144640&unique=9o2ltd scored 35% (review_needed). Primary intent: research. {\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T17:26:06.217Z",
      "version": "1.0"
    },
    {
      "id": "1ddd888f-e4e9-4fbd-8031-f7d7e3409ffd",
      "leadId": "0061acfd-d1ac-4568-b1ab-cdd9035f4be3",
      "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:52:40.358Z",
            "sourceUrl": "https://httpbin.org/html?t=1770479553092",
            "confidence": 0.4,
            "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
            "primaryIntent": "support"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "support",
                "context": "Matched keywords: issue, question",
                "confidence": 0.4
              }
            ],
            "summary": "Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999994809027778,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.12,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.40999994809027773,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 3,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.83062285
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.83062285
              },
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.83062285
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/html?t=1770479553092 scored 41% (review_needed). Primary intent: support. Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:52:40.361Z",
      "version": "1.0"
    },
    {
      "id": "d631d42d-a599-4ce3-aa86-9e51be8356bc",
      "leadId": "7fedac29-4da2-4f6a-9e13-89c84e64809b",
      "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:19.245Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182",
            "confidence": 0.8,
            "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999992893518518,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299999289351852,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 2,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:19.245Z",
      "version": "1.0"
    },
    {
      "id": "3f16a0db-53ac-406c-9ddc-700cfde0e4c4",
      "leadId": "1c048793-7e4a-45f0-9a4f-c29e63facdcc",
      "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:00.752Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275",
            "confidence": 0.8,
            "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499998761574074,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299998761574074,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 1,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:00.752Z",
      "version": "1.0"
    },
    {
      "id": "221befff-51d9-490f-bc7a-2bdca5adf5a0",
      "leadId": "914cafe4-7188-4667-992a-4dd8adc1b985",
      "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:47:26.584Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882",
            "confidence": 0.8,
            "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, price, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499854453125,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299854453125,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:47:26.584Z",
      "version": "1.0"
    }
  ],
  "count": 5
}
```

---

### 5. Poll Dossiers (attempt 2)

**Status:** ✅ PASS
**Duration:** 15ms

#### Request
```
GET http://localhost:3000/api/v1/dossiers?limit=100
```

#### Response (Status: 200)
```json
{
  "dossiers": [
    {
      "id": "365d5861-548d-4273-9c87-ea330c749df8",
      "leadId": "0cbb2e77-36c4-4f3d-89ef-c5408899b27e",
      "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T17:25:58.057Z",
            "sourceUrl": "https://httpbin.org/anything?t=1770485144640&unique=9o2ltd",
            "confidence": 0.2,
            "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
            "primaryIntent": "research"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "research",
                "context": "Matched keywords: data",
                "confidence": 0.2
              }
            ],
            "summary": "{\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
            "entities": [],
            "sentiment": {
              "neutral": 0.34,
              "negative": 0.33,
              "positive": 0.33
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999948940972221,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.06,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.34999948940972225,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 4,
            "documents": [
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.8676573
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.8676573
              },
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.8676573
              },
              {
                "id": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
                "similarity": 0.81019807
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/anything?t=1770485144640&unique=9o2ltd scored 35% (review_needed). Primary intent: research. {\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T17:26:06.217Z",
      "version": "1.0"
    },
    {
      "id": "1ddd888f-e4e9-4fbd-8031-f7d7e3409ffd",
      "leadId": "0061acfd-d1ac-4568-b1ab-cdd9035f4be3",
      "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:52:40.358Z",
            "sourceUrl": "https://httpbin.org/html?t=1770479553092",
            "confidence": 0.4,
            "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
            "primaryIntent": "support"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "support",
                "context": "Matched keywords: issue, question",
                "confidence": 0.4
              }
            ],
            "summary": "Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999994809027778,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.12,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.40999994809027773,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 3,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.83062285
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.83062285
              },
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.83062285
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/html?t=1770479553092 scored 41% (review_needed). Primary intent: support. Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:52:40.361Z",
      "version": "1.0"
    },
    {
      "id": "d631d42d-a599-4ce3-aa86-9e51be8356bc",
      "leadId": "7fedac29-4da2-4f6a-9e13-89c84e64809b",
      "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:19.245Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182",
            "confidence": 0.8,
            "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999992893518518,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299999289351852,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 2,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:19.245Z",
      "version": "1.0"
    },
    {
      "id": "3f16a0db-53ac-406c-9ddc-700cfde0e4c4",
      "leadId": "1c048793-7e4a-45f0-9a4f-c29e63facdcc",
      "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:00.752Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275",
            "confidence": 0.8,
            "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499998761574074,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299998761574074,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 1,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:00.752Z",
      "version": "1.0"
    },
    {
      "id": "221befff-51d9-490f-bc7a-2bdca5adf5a0",
      "leadId": "914cafe4-7188-4667-992a-4dd8adc1b985",
      "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:47:26.584Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882",
            "confidence": 0.8,
            "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, price, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499854453125,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299854453125,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:47:26.584Z",
      "version": "1.0"
    }
  ],
  "count": 5
}
```

---

### 6. Poll Dossiers (attempt 3)

**Status:** ✅ PASS
**Duration:** 69ms

#### Request
```
GET http://localhost:3000/api/v1/dossiers?limit=100
```

#### Response (Status: 200)
```json
{
  "dossiers": [
    {
      "id": "365d5861-548d-4273-9c87-ea330c749df8",
      "leadId": "0cbb2e77-36c4-4f3d-89ef-c5408899b27e",
      "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T17:25:58.057Z",
            "sourceUrl": "https://httpbin.org/anything?t=1770485144640&unique=9o2ltd",
            "confidence": 0.2,
            "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
            "primaryIntent": "research"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "research",
                "context": "Matched keywords: data",
                "confidence": 0.2
              }
            ],
            "summary": "{\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
            "entities": [],
            "sentiment": {
              "neutral": 0.34,
              "negative": 0.33,
              "positive": 0.33
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999948940972221,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.06,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.34999948940972225,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 4,
            "documents": [
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.8676573
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.8676573
              },
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.8676573
              },
              {
                "id": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
                "similarity": 0.81019807
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/anything?t=1770485144640&unique=9o2ltd scored 35% (review_needed). Primary intent: research. {\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T17:26:06.217Z",
      "version": "1.0"
    },
    {
      "id": "1ddd888f-e4e9-4fbd-8031-f7d7e3409ffd",
      "leadId": "0061acfd-d1ac-4568-b1ab-cdd9035f4be3",
      "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:52:40.358Z",
            "sourceUrl": "https://httpbin.org/html?t=1770479553092",
            "confidence": 0.4,
            "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
            "primaryIntent": "support"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "support",
                "context": "Matched keywords: issue, question",
                "confidence": 0.4
              }
            ],
            "summary": "Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999994809027778,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.12,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.40999994809027773,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 3,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.83062285
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.83062285
              },
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.83062285
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/html?t=1770479553092 scored 41% (review_needed). Primary intent: support. Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:52:40.361Z",
      "version": "1.0"
    },
    {
      "id": "d631d42d-a599-4ce3-aa86-9e51be8356bc",
      "leadId": "7fedac29-4da2-4f6a-9e13-89c84e64809b",
      "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:19.245Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182",
            "confidence": 0.8,
            "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999992893518518,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299999289351852,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 2,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:19.245Z",
      "version": "1.0"
    },
    {
      "id": "3f16a0db-53ac-406c-9ddc-700cfde0e4c4",
      "leadId": "1c048793-7e4a-45f0-9a4f-c29e63facdcc",
      "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:00.752Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275",
            "confidence": 0.8,
            "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499998761574074,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299998761574074,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 1,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:00.752Z",
      "version": "1.0"
    },
    {
      "id": "221befff-51d9-490f-bc7a-2bdca5adf5a0",
      "leadId": "914cafe4-7188-4667-992a-4dd8adc1b985",
      "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:47:26.584Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882",
            "confidence": 0.8,
            "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, price, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499854453125,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299854453125,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:47:26.584Z",
      "version": "1.0"
    }
  ],
  "count": 5
}
```

---

### 7. Poll Dossiers (attempt 4)

**Status:** ✅ PASS
**Duration:** 15ms

#### Request
```
GET http://localhost:3000/api/v1/dossiers?limit=100
```

#### Response (Status: 200)
```json
{
  "dossiers": [
    {
      "id": "365d5861-548d-4273-9c87-ea330c749df8",
      "leadId": "0cbb2e77-36c4-4f3d-89ef-c5408899b27e",
      "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T17:25:58.057Z",
            "sourceUrl": "https://httpbin.org/anything?t=1770485144640&unique=9o2ltd",
            "confidence": 0.2,
            "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
            "primaryIntent": "research"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "research",
                "context": "Matched keywords: data",
                "confidence": 0.2
              }
            ],
            "summary": "{\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
            "entities": [],
            "sentiment": {
              "neutral": 0.34,
              "negative": 0.33,
              "positive": 0.33
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999948940972221,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.06,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.34999948940972225,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 4,
            "documents": [
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.8676573
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.8676573
              },
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.8676573
              },
              {
                "id": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
                "similarity": 0.81019807
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/anything?t=1770485144640&unique=9o2ltd scored 35% (review_needed). Primary intent: research. {\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T17:26:06.217Z",
      "version": "1.0"
    },
    {
      "id": "1ddd888f-e4e9-4fbd-8031-f7d7e3409ffd",
      "leadId": "0061acfd-d1ac-4568-b1ab-cdd9035f4be3",
      "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:52:40.358Z",
            "sourceUrl": "https://httpbin.org/html?t=1770479553092",
            "confidence": 0.4,
            "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
            "primaryIntent": "support"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "support",
                "context": "Matched keywords: issue, question",
                "confidence": 0.4
              }
            ],
            "summary": "Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999994809027778,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.12,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.40999994809027773,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 3,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.83062285
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.83062285
              },
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.83062285
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/html?t=1770479553092 scored 41% (review_needed). Primary intent: support. Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:52:40.361Z",
      "version": "1.0"
    },
    {
      "id": "d631d42d-a599-4ce3-aa86-9e51be8356bc",
      "leadId": "7fedac29-4da2-4f6a-9e13-89c84e64809b",
      "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:19.245Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182",
            "confidence": 0.8,
            "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999992893518518,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299999289351852,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 2,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:19.245Z",
      "version": "1.0"
    },
    {
      "id": "3f16a0db-53ac-406c-9ddc-700cfde0e4c4",
      "leadId": "1c048793-7e4a-45f0-9a4f-c29e63facdcc",
      "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:00.752Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275",
            "confidence": 0.8,
            "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499998761574074,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299998761574074,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 1,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:00.752Z",
      "version": "1.0"
    },
    {
      "id": "221befff-51d9-490f-bc7a-2bdca5adf5a0",
      "leadId": "914cafe4-7188-4667-992a-4dd8adc1b985",
      "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:47:26.584Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882",
            "confidence": 0.8,
            "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, price, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499854453125,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299854453125,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:47:26.584Z",
      "version": "1.0"
    }
  ],
  "count": 5
}
```

---

### 8. Poll Dossiers (attempt 5)

**Status:** ✅ PASS
**Duration:** 12ms

#### Request
```
GET http://localhost:3000/api/v1/dossiers?limit=100
```

#### Response (Status: 200)
```json
{
  "dossiers": [
    {
      "id": "365d5861-548d-4273-9c87-ea330c749df8",
      "leadId": "0cbb2e77-36c4-4f3d-89ef-c5408899b27e",
      "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T17:25:58.057Z",
            "sourceUrl": "https://httpbin.org/anything?t=1770485144640&unique=9o2ltd",
            "confidence": 0.2,
            "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
            "primaryIntent": "research"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "research",
                "context": "Matched keywords: data",
                "confidence": 0.2
              }
            ],
            "summary": "{\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
            "entities": [],
            "sentiment": {
              "neutral": 0.34,
              "negative": 0.33,
              "positive": 0.33
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999948940972221,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.06,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.34999948940972225,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 4,
            "documents": [
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.8676573
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.8676573
              },
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.8676573
              },
              {
                "id": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
                "similarity": 0.81019807
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/anything?t=1770485144640&unique=9o2ltd scored 35% (review_needed). Primary intent: research. {\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T17:26:06.217Z",
      "version": "1.0"
    },
    {
      "id": "1ddd888f-e4e9-4fbd-8031-f7d7e3409ffd",
      "leadId": "0061acfd-d1ac-4568-b1ab-cdd9035f4be3",
      "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:52:40.358Z",
            "sourceUrl": "https://httpbin.org/html?t=1770479553092",
            "confidence": 0.4,
            "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
            "primaryIntent": "support"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "support",
                "context": "Matched keywords: issue, question",
                "confidence": 0.4
              }
            ],
            "summary": "Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999994809027778,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.12,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.40999994809027773,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 3,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.83062285
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.83062285
              },
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.83062285
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/html?t=1770479553092 scored 41% (review_needed). Primary intent: support. Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:52:40.361Z",
      "version": "1.0"
    },
    {
      "id": "d631d42d-a599-4ce3-aa86-9e51be8356bc",
      "leadId": "7fedac29-4da2-4f6a-9e13-89c84e64809b",
      "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:19.245Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182",
            "confidence": 0.8,
            "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999992893518518,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299999289351852,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 2,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:19.245Z",
      "version": "1.0"
    },
    {
      "id": "3f16a0db-53ac-406c-9ddc-700cfde0e4c4",
      "leadId": "1c048793-7e4a-45f0-9a4f-c29e63facdcc",
      "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:00.752Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275",
            "confidence": 0.8,
            "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499998761574074,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299998761574074,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 1,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:00.752Z",
      "version": "1.0"
    },
    {
      "id": "221befff-51d9-490f-bc7a-2bdca5adf5a0",
      "leadId": "914cafe4-7188-4667-992a-4dd8adc1b985",
      "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:47:26.584Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882",
            "confidence": 0.8,
            "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, price, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499854453125,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299854453125,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:47:26.584Z",
      "version": "1.0"
    }
  ],
  "count": 5
}
```

---

### 9. Poll Dossiers (attempt 6)

**Status:** ✅ PASS
**Duration:** 8ms

#### Request
```
GET http://localhost:3000/api/v1/dossiers?limit=100
```

#### Response (Status: 200)
```json
{
  "dossiers": [
    {
      "id": "365d5861-548d-4273-9c87-ea330c749df8",
      "leadId": "0cbb2e77-36c4-4f3d-89ef-c5408899b27e",
      "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T17:25:58.057Z",
            "sourceUrl": "https://httpbin.org/anything?t=1770485144640&unique=9o2ltd",
            "confidence": 0.2,
            "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
            "primaryIntent": "research"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "research",
                "context": "Matched keywords: data",
                "confidence": 0.2
              }
            ],
            "summary": "{\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
            "entities": [],
            "sentiment": {
              "neutral": 0.34,
              "negative": 0.33,
              "positive": 0.33
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999948940972221,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.06,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.34999948940972225,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 4,
            "documents": [
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.8676573
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.8676573
              },
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.8676573
              },
              {
                "id": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
                "similarity": 0.81019807
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/anything?t=1770485144640&unique=9o2ltd scored 35% (review_needed). Primary intent: research. {\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T17:26:06.217Z",
      "version": "1.0"
    },
    {
      "id": "1ddd888f-e4e9-4fbd-8031-f7d7e3409ffd",
      "leadId": "0061acfd-d1ac-4568-b1ab-cdd9035f4be3",
      "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:52:40.358Z",
            "sourceUrl": "https://httpbin.org/html?t=1770479553092",
            "confidence": 0.4,
            "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
            "primaryIntent": "support"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "support",
                "context": "Matched keywords: issue, question",
                "confidence": 0.4
              }
            ],
            "summary": "Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999994809027778,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.12,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.40999994809027773,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 3,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.83062285
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.83062285
              },
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.83062285
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/html?t=1770479553092 scored 41% (review_needed). Primary intent: support. Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:52:40.361Z",
      "version": "1.0"
    },
    {
      "id": "d631d42d-a599-4ce3-aa86-9e51be8356bc",
      "leadId": "7fedac29-4da2-4f6a-9e13-89c84e64809b",
      "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:19.245Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182",
            "confidence": 0.8,
            "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999992893518518,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299999289351852,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 2,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:19.245Z",
      "version": "1.0"
    },
    {
      "id": "3f16a0db-53ac-406c-9ddc-700cfde0e4c4",
      "leadId": "1c048793-7e4a-45f0-9a4f-c29e63facdcc",
      "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:00.752Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275",
            "confidence": 0.8,
            "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499998761574074,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299998761574074,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 1,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:00.752Z",
      "version": "1.0"
    },
    {
      "id": "221befff-51d9-490f-bc7a-2bdca5adf5a0",
      "leadId": "914cafe4-7188-4667-992a-4dd8adc1b985",
      "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:47:26.584Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882",
            "confidence": 0.8,
            "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, price, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499854453125,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299854453125,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:47:26.584Z",
      "version": "1.0"
    }
  ],
  "count": 5
}
```

---

### 10. Poll Dossiers (attempt 7)

**Status:** ✅ PASS
**Duration:** 11ms

#### Request
```
GET http://localhost:3000/api/v1/dossiers?limit=100
```

#### Response (Status: 200)
```json
{
  "dossiers": [
    {
      "id": "365d5861-548d-4273-9c87-ea330c749df8",
      "leadId": "0cbb2e77-36c4-4f3d-89ef-c5408899b27e",
      "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T17:25:58.057Z",
            "sourceUrl": "https://httpbin.org/anything?t=1770485144640&unique=9o2ltd",
            "confidence": 0.2,
            "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
            "primaryIntent": "research"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "research",
                "context": "Matched keywords: data",
                "confidence": 0.2
              }
            ],
            "summary": "{\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
            "entities": [],
            "sentiment": {
              "neutral": 0.34,
              "negative": 0.33,
              "positive": 0.33
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999948940972221,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.06,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.34999948940972225,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 4,
            "documents": [
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.8676573
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.8676573
              },
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.8676573
              },
              {
                "id": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
                "similarity": 0.81019807
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/anything?t=1770485144640&unique=9o2ltd scored 35% (review_needed). Primary intent: research. {\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T17:26:06.217Z",
      "version": "1.0"
    },
    {
      "id": "1ddd888f-e4e9-4fbd-8031-f7d7e3409ffd",
      "leadId": "0061acfd-d1ac-4568-b1ab-cdd9035f4be3",
      "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:52:40.358Z",
            "sourceUrl": "https://httpbin.org/html?t=1770479553092",
            "confidence": 0.4,
            "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
            "primaryIntent": "support"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "support",
                "context": "Matched keywords: issue, question",
                "confidence": 0.4
              }
            ],
            "summary": "Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999994809027778,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.12,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.40999994809027773,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 3,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.83062285
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.83062285
              },
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.83062285
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/html?t=1770479553092 scored 41% (review_needed). Primary intent: support. Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:52:40.361Z",
      "version": "1.0"
    },
    {
      "id": "d631d42d-a599-4ce3-aa86-9e51be8356bc",
      "leadId": "7fedac29-4da2-4f6a-9e13-89c84e64809b",
      "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:19.245Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182",
            "confidence": 0.8,
            "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999992893518518,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299999289351852,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 2,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:19.245Z",
      "version": "1.0"
    },
    {
      "id": "3f16a0db-53ac-406c-9ddc-700cfde0e4c4",
      "leadId": "1c048793-7e4a-45f0-9a4f-c29e63facdcc",
      "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:00.752Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275",
            "confidence": 0.8,
            "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499998761574074,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299998761574074,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 1,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:00.752Z",
      "version": "1.0"
    },
    {
      "id": "221befff-51d9-490f-bc7a-2bdca5adf5a0",
      "leadId": "914cafe4-7188-4667-992a-4dd8adc1b985",
      "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:47:26.584Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882",
            "confidence": 0.8,
            "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, price, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499854453125,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299854453125,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:47:26.584Z",
      "version": "1.0"
    }
  ],
  "count": 5
}
```

---

### 11. Poll Dossiers (attempt 8)

**Status:** ✅ PASS
**Duration:** 12ms

#### Request
```
GET http://localhost:3000/api/v1/dossiers?limit=100
```

#### Response (Status: 200)
```json
{
  "dossiers": [
    {
      "id": "5b7b4ddb-84e2-4d44-a9e5-329a6e8cec34",
      "leadId": "f3b97c91-dc9f-41d0-b222-e086906a484c",
      "documentId": "12b7379d-1441-404a-a052-7488bf3394e9",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T18:51:33.645Z",
            "sourceUrl": "https://httpbin.org/anything?t=1770490271120&unique=ydb0n5",
            "confidence": 0.2,
            "documentId": "12b7379d-1441-404a-a052-7488bf3394e9",
            "primaryIntent": "research"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "research",
                "context": "Matched keywords: data",
                "confidence": 0.2
              }
            ],
            "summary": "{\n\"args\": {\n\"t\": \"1770490271120\",\n\"unique\": \"ydb0n5\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
            "entities": [],
            "sentiment": {
              "neutral": 0.34,
              "negative": 0.33,
              "positive": 0.33
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499992042824074,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.06,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.3499992042824074,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 4,
            "documents": [
              {
                "id": "72a5a62e-0315-4312-8bca-6ff4081c2083",
                "similarity": 0.9867968
              },
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.85939103
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.85939103
              },
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.85939103
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/anything?t=1770490271120&unique=ydb0n5 scored 35% (review_needed). Primary intent: research. {\n\"args\": {\n\"t\": \"1770490271120\",\n\"unique\": \"ydb0n5\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T18:51:44.606Z",
      "version": "1.0"
    },
    {
      "id": "365d5861-548d-4273-9c87-ea330c749df8",
      "leadId": "0cbb2e77-36c4-4f3d-89ef-c5408899b27e",
      "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T17:25:58.057Z",
            "sourceUrl": "https://httpbin.org/anything?t=1770485144640&unique=9o2ltd",
            "confidence": 0.2,
            "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
            "primaryIntent": "research"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "research",
                "context": "Matched keywords: data",
                "confidence": 0.2
              }
            ],
            "summary": "{\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
            "entities": [],
            "sentiment": {
              "neutral": 0.34,
              "negative": 0.33,
              "positive": 0.33
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999948940972221,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.06,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.34999948940972225,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 4,
            "documents": [
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.8676573
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.8676573
              },
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.8676573
              },
              {
                "id": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
                "similarity": 0.81019807
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/anything?t=1770485144640&unique=9o2ltd scored 35% (review_needed). Primary intent: research. {\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T17:26:06.217Z",
      "version": "1.0"
    },
    {
      "id": "1ddd888f-e4e9-4fbd-8031-f7d7e3409ffd",
      "leadId": "0061acfd-d1ac-4568-b1ab-cdd9035f4be3",
      "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:52:40.358Z",
            "sourceUrl": "https://httpbin.org/html?t=1770479553092",
            "confidence": 0.4,
            "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
            "primaryIntent": "support"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "support",
                "context": "Matched keywords: issue, question",
                "confidence": 0.4
              }
            ],
            "summary": "Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999994809027778,
              "sourceTrust": 0.04000000000000001,
              "llmConfidence": 0.12,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.40999994809027773,
            "reasonCodes": [
              "LOW_LLM_CONFIDENCE",
              "UNTRUSTED_SOURCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 3,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 0.83062285
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 0.83062285
              },
              {
                "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
                "similarity": 0.83062285
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://httpbin.org/html?t=1770479553092 scored 41% (review_needed). Primary intent: support. Availing himself of the mild, summer-cool weather that now reigned in these latitudes, and in preparation for the peculiarly active pursuits shortly to be anticipated, Perth, the begrimed, blistered o...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "VERIFY: Cross-reference with trusted sources",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:52:40.361Z",
      "version": "1.0"
    },
    {
      "id": "d631d42d-a599-4ce3-aa86-9e51be8356bc",
      "leadId": "7fedac29-4da2-4f6a-9e13-89c84e64809b",
      "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:19.245Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182",
            "confidence": 0.8,
            "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.14999992893518518,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299999289351852,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 2,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              },
              {
                "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:19.245Z",
      "version": "1.0"
    },
    {
      "id": "3f16a0db-53ac-406c-9ddc-700cfde0e4c4",
      "leadId": "1c048793-7e4a-45f0-9a4f-c29e63facdcc",
      "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:49:00.752Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275",
            "confidence": 0.8,
            "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499998761574074,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299998761574074,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        },
        {
          "title": "Related Documents",
          "content": {
            "count": 1,
            "documents": [
              {
                "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
                "similarity": 1
              }
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:49:00.752Z",
      "version": "1.0"
    },
    {
      "id": "221befff-51d9-490f-bc7a-2bdca5adf5a0",
      "leadId": "914cafe4-7188-4667-992a-4dd8adc1b985",
      "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
      "sections": [
        {
          "title": "Overview",
          "content": {
            "fetchedAt": "2026-02-07T15:47:26.584Z",
            "sourceUrl": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882",
            "confidence": 0.8,
            "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
            "primaryIntent": "product"
          }
        },
        {
          "title": "Intent Analysis",
          "content": {
            "intents": [
              {
                "name": "product",
                "context": "Matched keywords: product, purchase, price, cost, sale",
                "confidence": 0.8
              },
              {
                "name": "support",
                "context": "Matched keywords: help, issue, problem, support, question, how to",
                "confidence": 0.8
              },
              {
                "name": "feedback",
                "context": "Matched keywords: feedback, review, opinion, think, feel",
                "confidence": 0.8
              },
              {
                "name": "news",
                "context": "Matched keywords: news, announce, release, launch",
                "confidence": 0.8
              },
              {
                "name": "research",
                "context": "Matched keywords: research, study, analysis, report, data",
                "confidence": 0.8
              }
            ],
            "summary": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
            "entities": [],
            "sentiment": {
              "neutral": 0.2,
              "negative": 0.1,
              "positive": 0.7
            }
          }
        },
        {
          "title": "Scoring Breakdown",
          "content": {
            "status": "review_needed",
            "weights": {
              "freshness": 0.1499854453125,
              "sourceTrust": 0.13999999999999999,
              "llmConfidence": 0.24,
              "signalDensity": 0,
              "embeddingSimilarity": 0.1
            },
            "finalScore": 0.6299854453125,
            "reasonCodes": [
              "HIGH_LLM_CONFIDENCE",
              "RECENT_CONTENT",
              "LOW_SIGNAL_DENSITY"
            ]
          }
        }
      ],
      "humanSummary": "Lead from https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882 scored 63% (review_needed). Primary intent: product. Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azər...",
      "recommendations": [
        "REVIEW: Manual verification required",
        "ESCALATE: Flag for human review within 24 hours",
        "ENRICH: Gather additional data points"
      ],
      "createdAt": "2026-02-07T15:47:26.584Z",
      "version": "1.0"
    }
  ],
  "count": 6
}
```

---

### 12. Dossier Generation

**Status:** ✅ PASS
**Duration:** 35151ms


#### Response (Status: 200)
```json
{
  "dossierId": "5b7b4ddb-84e2-4d44-a9e5-329a6e8cec34"
}
```

---

### 13. Get Dossier Details

**Status:** ✅ PASS
**Duration:** 70ms

#### Request
```
GET http://localhost:3000/api/v1/dossiers/5b7b4ddb-84e2-4d44-a9e5-329a6e8cec34
```

#### Response (Status: 200)
```json
{
  "id": "5b7b4ddb-84e2-4d44-a9e5-329a6e8cec34",
  "leadId": "f3b97c91-dc9f-41d0-b222-e086906a484c",
  "documentId": "12b7379d-1441-404a-a052-7488bf3394e9",
  "sections": [
    {
      "title": "Overview",
      "content": {
        "fetchedAt": "2026-02-07T18:51:33.645Z",
        "sourceUrl": "https://httpbin.org/anything?t=1770490271120&unique=ydb0n5",
        "confidence": 0.2,
        "documentId": "12b7379d-1441-404a-a052-7488bf3394e9",
        "primaryIntent": "research"
      }
    },
    {
      "title": "Intent Analysis",
      "content": {
        "intents": [
          {
            "name": "research",
            "context": "Matched keywords: data",
            "confidence": 0.2
          }
        ],
        "summary": "{\n\"args\": {\n\"t\": \"1770490271120\",\n\"unique\": \"ydb0n5\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
        "entities": [],
        "sentiment": {
          "neutral": 0.34,
          "negative": 0.33,
          "positive": 0.33
        }
      }
    },
    {
      "title": "Scoring Breakdown",
      "content": {
        "status": "review_needed",
        "weights": {
          "freshness": 0.1499992042824074,
          "sourceTrust": 0.04000000000000001,
          "llmConfidence": 0.06,
          "signalDensity": 0,
          "embeddingSimilarity": 0.1
        },
        "finalScore": 0.3499992042824074,
        "reasonCodes": [
          "LOW_LLM_CONFIDENCE",
          "UNTRUSTED_SOURCE",
          "RECENT_CONTENT",
          "LOW_SIGNAL_DENSITY"
        ]
      }
    },
    {
      "title": "Related Documents",
      "content": {
        "count": 4,
        "documents": [
          {
            "id": "72a5a62e-0315-4312-8bca-6ff4081c2083",
            "similarity": 0.9867968
          },
          {
            "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
            "similarity": 0.85939103
          },
          {
            "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
            "similarity": 0.85939103
          },
          {
            "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
            "similarity": 0.85939103
          }
        ]
      }
    }
  ],
  "humanSummary": "Lead from https://httpbin.org/anything?t=1770490271120&unique=ydb0n5 scored 35% (review_needed). Primary intent: research. {\n\"args\": {\n\"t\": \"1770490271120\",\n\"unique\": \"ydb0n5\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encod...",
  "recommendations": [
    "REVIEW: Manual verification required",
    "ESCALATE: Flag for human review within 24 hours",
    "VERIFY: Cross-reference with trusted sources",
    "ENRICH: Gather additional data points"
  ],
  "createdAt": "2026-02-07T18:51:44.606Z",
  "version": "1.0"
}
```

---

### 14. Submit Feedback

**Status:** ✅ PASS
**Duration:** 41ms

#### Request
```
POST http://localhost:3000/api/v1/feedback
```
**Body:**
```json
{
  "dossierId": "5b7b4ddb-84e2-4d44-a9e5-329a6e8cec34",
  "type": "positive",
  "score": 0.9,
  "comment": "Automated test feedback"
}
```

#### Response (Status: 201)
```json
{
  "id": "a7dac061-5567-4b73-b238-ed826a5c9904",
  "dossierId": "5b7b4ddb-84e2-4d44-a9e5-329a6e8cec34",
  "type": "positive",
  "score": 0.9,
  "comment": "Automated test feedback",
  "createdAt": "2026-02-07T18:51:46.384Z"
}
```

---

### 15. Search Documents

**Status:** ✅ PASS
**Duration:** 55ms

#### Request
```
POST http://localhost:3000/api/v1/search
```
**Body:**
```json
{
  "query": "test document intelligence",
  "limit": 5
}
```

#### Response (Status: 200)
```json
{
  "results": [
    {
      "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
      "score": 0.8209865,
      "document": {
        "id": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
        "url": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479331275",
        "text": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azərbaycanca\n\n• تۆرکجه\n\n• বাংলা\n\n• 閩南語 / Bân-lâm-gí\n\n• Башҡортса\n\n• Беларуская\n\n• Беларуская (тарашкевіца)\n\n• भोजपुरी\n\n• Bikol Central\n\n• Български\n\n• Boarisch\n\n• བོད་ཡིག\n\n• Bosanski\n\n• Brezhoneg\n\n• Буряад\n\n• Català\n\n• Чӑвашла\n\n• Cebuano\n\n• Čeština\n\n• Cymraeg\n\n• Dansk\n\n• الدارجة\n\n• Deutsch\n\n• Eesti\n\n• Ελληνικά\n\n• Español\n\n• Esperanto\n\n• Estremeñu\n\n• Euskara\n\n• فارسی\n\n• Fiji Hindi\n\n• Français\n\n• Furlan\n\n• Gaeilge\n\n• Gaelg\n\n• Gàidhlig\n\n• Galego\n\n• 贛語\n\n• Gĩkũyũ\n\n• गोंयची कोंकणी / Gõychi Konknni\n\n• 한국어\n\n• Hausa\n\n• Հայերեն\n\n• हिन्दी\n\n• Hrvatski\n\n• Ido\n\n• Igbo\n\n• Ilokano\n\n• Bahasa Indonesia\n\n• Interlingua\n\n• Interlingue\n\n• IsiZulu\n\n• Íslenska\n\n• Italiano\n\n• עברית\n\n• Jawa\n\n• ಕನ್ನಡ\n\n• ქართული\n\n• کٲشُر\n\n• Қазақша\n\n• Kiswahili\n\n• Kreyòl ayisyen\n\n• Kriyòl gwiyannen\n\n• Kurdî\n\n• Кыргызча\n\n• ລາວ\n\n• Latina\n\n• Latviešu\n\n• Lëtzebuergesch\n\n• Lietuvių\n\n• Ligure\n\n• Limburgs\n\n• La. lojban.\n\n• Lombard\n\n• Magyar\n\n• Madhurâ\n\n• Македонски\n\n• Malagasy\n\n• മലയാളം\n\n• Malti\n\n• मराठी\n\n• მარგალური\n\n• مصرى\n\n• Bahasa Melayu\n\n• Minangkabau\n\n• Монгол\n\n• မြန်မာဘာသာ\n\n• Nederlands\n\n• Nedersaksies\n\n• नेपाली\n\n• नेपाल भाषा\n\n• 日本語\n\n• Nordfriisk\n\n• Norsk bokmål\n\n• Norsk nynorsk\n\n• Occitan\n\n• ଓଡ଼ିଆ\n\n• Oʻzbekcha / ўзбекча\n\n• ਪੰਜਾਬੀ\n\n• پنجابی\n\n• ပအိုဝ်ႏဘာႏသာႏ\n\n• پښتو\n\n• Patois\n\n• ភាសាខ្មែរ\n\n• Picard\n\n• Piemontèis\n\n• Plattdüütsch\n\n• Polski\n\n• Português\n\n• Qaraqalpaqsha\n\n• Qırımtatarca\n\n• Reo tahiti\n\n• Ripoarisch\n\n• Română\n\n• Runa Simi\n\n• Русиньскый\n\n• Русский\n\n• Саха тыла\n\n• संस्कृतम्\n\n• Sängö\n\n• Scots\n\n• Sesotho sa Leboa\n\n• Shqip\n\n• Sicilianu\n\n• සිංහල\n\n• Simple English\n\n• سنڌي\n\n• Slovenčina\n\n• Slovenščina\n\n• کوردی\n\n• Српски / srpski\n\n• Srpskohrvatski / српскохрватски\n\n• Suomi\n\n• Svenska\n\n• Tagalog\n\n• தமிழ்\n\n• Татарча / tatarça\n\n• తెలుగు\n\n• ไทย\n\n• Тоҷикӣ\n\n• Türkçe\n\n• Türkmençe\n\n• Українська\n\n• اردو\n\n• ئۇيغۇرچە / Uyghurche\n\n• Vèneto\n\n• Tiếng Việt\n\n• Võro\n\n• Walon\n\n• 文言\n\n• Winaray\n\n• 吴语\n\n• ייִדיש\n\n• 粵語\n\n• Zazaki\n\n• Žemaitėška\n\n• 中文\n\n• Betawi\n\n• Kadazandusun\n\n• Fɔ̀ngbè\n\n• Jaku Iban\n\n• ꠍꠤꠟꠐꠤ\n\n• ⵜⴰⵎⴰⵣⵉⵖⵜ ⵜⴰⵏⴰⵡⴰⵢⵜ\n\nEdit links\n\n• Article\n\n• Talk\n\nEnglish\n\n• Read\n\n• View source\n\n• View history\n\nTools\n\nTools\n\nmove to sidebar\nhide\n\nActions\n\n• Read\n\n• View source\n\n• View history\n\nGeneral\n\n• What links here\n\n• Related changes\n\n• Upload file\n\n• Permanent link\n\n• Page information\n\n• Cite this page\n\n• Get shortened URL\n\n• Download QR code\n\n• Expand all\n\n• Edit interlanguage links\n\nPrint/export\n\n• Download as PDF\n\n• Printable version\n\nIn other projects\n\n• Wikimedia Commons\n\n• Wikibooks\n\n• Wikiquote\n\n• Wikiversity\n\n• Wikidata item\n\nAppearance\n\nmove to sidebar\nhide\n\nText\n\n•\n\nSmall\n\nStandard\n\nLarge\n\nThis page always uses small font size\n\nWidth\n\n•\n\nStandard\n\nWide\n\nThe content is as wide as possible for your browser window.\n\nColor (beta)\n\n•\n\nAutomatic\n\nLight\n\nDark\n\nThis page is always in light mode.\n\nFrom Wikipedia, the free encyclopedia\n\n\"AI\" redirects here. For other uses, see AI (disambiguation) and Artificial intelligence (disambiguation).\n\nPart of a series on\n\nArtificial intelligence (AI)\n\nshow\nMajor goals\n\nshow\nApproaches\n\nshow\nApplications\n\nshow\nPhilosophy\n\nshow\nHistory\n\nshow\nControversies\n\nshow\nGlossary\n\n• v\n\n• t\n\n• e\n\nArtificial intelligence (AI) is the capability of computational systems to perform tasks typically associated with human intelligence, such as learning, reasoning, problem-solving, perception, and decision-making. It is a field of research in computer science that develops and studies methods and software that enable machines to perceive their environment and use learning and intelligence to take actions that maximize their chances of achieving defined goals.[1]\n\nHigh-profile applications of AI include advanced web search engines (e. g., Google Search); recommendation systems (used by YouTube, Amazon, and Netflix); virtual assistants (e. g., Google Assistant, Siri, and Alexa); autonomous vehicles (e. g., Waymo); generative and creative tools (e. g., language models and AI art); and superhuman play and analysis in strategy games (e. g., chess and Go). However, many AI applications are not perceived as AI: \"A lot of cutting edge AI has filtered into general applications, often without being called AI because once something becomes useful enough and common enough it's not labeled AI anymore.\"[2][3]\n\nVarious subfields of AI research are centered around particular goals and the use of particular tools. The traditional goals of AI research include learning, reasoning, knowledge representation, planning, natural language processing, perception, and support for robotics.[a] To reach these goals, AI researchers have adapted and integrated a wide range of techniques, including search and mathematical optimization, formal logic, artificial neural networks, and methods based on statistics, operations research, and economics.[b] AI also draws upon psychology, linguistics, philosophy, neuroscience, and other fields.[4] Some companies, such as OpenAI, Google DeepMind and Meta,[5] aim to create artificial general intelligence (AGI) - AI that can complete virtually any cognitive task at least as well as a human.\n\nArtificial intelligence was founded as an academic discipline in 1956,[6] and the field went through multiple cycles of optimism throughout its history,[7][8] followed by periods of disappointment and loss of funding, known as AI winters.[9][10] Funding and interest vastly increased after 2012 when graphics processing units started being used to accelerate neural networks, and deep learning outperformed previous AI techniques.[11] This growth accelerated further after 2017 with the transformer architecture.[12] In the 2020s, an ongoing period of rapid progress in advanced generative AI became known as the AI boom. Generative AI's ability to create and modify content has led to several unintended consequences and harms. Ethical concerns have been raised about AI's long-term effects and potential existential risks, prompting discussions about regulatory policies to ensure the safety and benefits of the technology.\n\n## Goals\n\nThe general problem of simulating (or creating) intelligence has been broken into subproblems. These consist of particular traits or capabilities that researchers expect an intelligent system to display. The traits described below have received the most attention and cover the scope of AI research.[a]\n\n### Reasoning and problem-solving\n\nEarly researchers developed algorithms that imitated step-by-step reasoning that humans use when they solve puzzles or make logical deductions.[13] By the late 1980s and 1990s, methods were developed for dealing with uncertain or incomplete information, employing concepts from probability and economics.[14]\n\nMany of these algorithms are insufficient for solving large reasoning problems because they experience a \"combinatorial explosion\": They become exponentially slower as the problems grow.[15] Even humans rarely use the step-by-step deduction that early AI research could model. They solve most of their problems using fast, intuitive judgments.[16] Accurate and efficient reasoning is an unsolved problem.\n\n### Knowledge representation\n\nAn ontology represents knowledge as a set of concepts within a domain and the relationships between those concepts.\n\nKnowledge representation and knowledge engineering[17] allow AI programs to answer questions intelligently and make deductions about real-world facts. Formal knowledge representations are used in content-based indexing and retrieval,[18] scene interpretation,[19] clinical decision support,[20] knowledge discovery (mining \"interesting\" and actionable inferences from large databases),[21] and other areas.[22]\n\nA knowledge base is a body of knowledge represented in a form that can be used by a program. An ontology is the set of objects, relations, concepts, and properties used by a particular domain of knowledge.[23] Knowledge bases need to represent things such as objects, properties, categories, and relations between objects;[24] situations, events, states, and time;[25] causes and effects;[26] knowledge about knowledge (what we know about what other people know);[27] default reasoning (things that humans assume are true until they are told differently and will remain true even when other facts are changing);[28] and many other aspects and domains of knowledge.\n\nAmong the most difficult problems in knowledge representation are the breadth of commonsense knowledge (the set of atomic facts that the average person knows is enormous);[29] and the sub-symbolic form of most commonsense knowledge (much of what people know is not represented as \"facts\" or \"statements\" that they could express verbally).[16] There is also the difficulty of knowledge acquisition, the problem of obtaining knowledge for AI applications.[c]\n\n### Planning and decision-making\n\nAn \"agent\" is anything that perceives and takes actions in the world. A rational agent has goals or preferences and takes actions to make them happen.[d][32] In automated planning, the agent has a specific goal.[33] In automated decision-making, the agent has preferences-there are some situations it would prefer to be in, and some situations it is trying to avoid. The decision-making agent assigns a number to each situation (called the \"utility\") that measures how much the agent prefers it. For each possible action, it can calculate the \"expected utility\": the utility of all possible outcomes of the action, weighted by the probability that the outcome will occur. It can then choose the action with the maximum expected utility.[34]\n\nIn classical planning, the agent knows exactly what the effect of any action will be.[35] In most real-world problems, however, the agent may not be certain about the situation they are in (it is \"unknown\" or \"unobservable\") and it may not know for certain what will happen after each possible action (it is not \"deterministic\"). It must choose an action by making a probabilistic guess and then reassess the situation to see if the action worked.[36]\n\nIn some problems, the agent's preferences may be uncertain, especially if there are other agents or humans involved. These can be learned (e. g., with inverse reinforcement learning), or the agent can seek information to improve its preferences.[37] Information value theory can be used to weigh the value of exploratory or experimental actions.[38] The space of possible future actions and situations is typically intractably large, so the agents must take actions and evaluate situations while being uncertain of what the outcome will be.\n\nA Markov decision process has a transition model that describes the probability that a particular action will change the state in a particular way and a reward function that supplies the utility of each state and the cost of each action. A policy associates a decision with each possible state. The policy could be calculated (e. g., by iteration), be heuristic, or it can be learned.[39]\n\nGame theory describes the rational behavior of multiple interacting agents and is used in AI programs that make decisions that involve other agents.[40]\n\n### Learning\n\nMachine learning is the study of programs that can improve their performance on a given task automatically.[41] It has been a part of AI from the beginning.[e]\n\nIn supervised learning, the training data is labelled with the expected answers, while in unsupervised learning, the model identifies patterns or structures in unlabelled data.\n\nThere are several kinds of machine learning. Unsupervised learning analyzes a stream of data and finds patterns and makes predictions without any other guidance.[44] Supervised learning requires labeling the training data with the expected answers, and comes in two main varieties: classification (where the program must learn to predict what category the input belongs in) and regression (where the program must deduce a numeric function based on numeric input).[45]\n\nIn reinforcement learning, the agent is rewarded for good responses and punished for bad ones. The agent learns to choose responses that are classified as \"good\".[46] Transfer learning is when the knowledge gained from one problem is applied to a new problem.[47] Deep learning is a type of machine learning that runs inputs through biologically inspired artificial neural networks for all of these types of learning.[48]\n\nComputational learning theory can assess learners by computational complexity, by sample complexity (how much data is required), or by other notions of optimization.[49]\n\n### Natural language processing\n\nNatural language processing (NLP) allows programs to read, write and communicate in human languages.[50] Specific problems include speech recognition, speech synthesis, machine translation, information extraction, information retrieval and question answering.[51]\n\nEarly work, based on Noam Chomsky's generative grammar and semantic networks, had difficulty with word-sense disambiguation[f] unless restricted to small domains called \"micro-worlds\" (due to the common sense knowledge problem[29]). Margaret Masterman believed that it was meaning and not grammar that was the key to understanding languages, and that thesauri and not dictionaries should be the basis of computational language structure.\n\nModern deep learning techniques for NLP include word embedding (representing words, typically as vectors encoding their meaning),[52] transformers (a deep learning architecture using an attention mechanism),[53] and others.[54] In 2019, generative pre-trained transformer (or \"GPT\") language models began to generate coherent text,[55][56] and by 2023, these models were able to get human-level scores on the bar exam, SAT test, GRE test, and many other real-world applications.[57]\n\n### Perception\n\nMachine perception is the ability to use input from sensors (such as cameras, microphones, wireless signals, active lidar, sonar, radar, and tactile sensors) to deduce aspects of the world. Computer vision is the ability to analyze visual input.[58]\n\nThe field includes speech recognition,[59] image classification,[60] facial recognition, object recognition,[61] object tracking,[62] and robotic perception.[63]\n\n### Social intelligence\n\nKismet, a robot head which was made in the 1990s; it is a machine that can recognize and simulate emotions.[64]\n\nAffective computing is a field that comprises systems that recognize, interpret, process, or simulate human feeling, emotion, and mood.[65] For example, some virtual assistants are programmed to speak conversationally or even to banter humorously; it makes them appear more sensitive to the emotional dynamics of human interaction, or to otherwise facilitate human-computer interaction.\n\nHowever, this tends to give naïve users an unrealistic conception of the intelligence of existing computer agents.[66] Moderate successes related to affective computing include textual sentiment analysis and, more recently, multimodal sentiment analysis, wherein AI classifies the effects displayed by a videotaped subject.[67]\n\n### General intelligence\n\nA machine with artificial general intelligence would be able to solve a wide variety of problems with breadth and versatility similar to human intelligence.[68]\n\n## Techniques\n\nAI research uses a wide variety of techniques to accomplish the goals above.[b]\n\n### Search and optimization\n\nAI can solve many problems by intelligently searching through many possible solutions.[69] There are two very different kinds of search used in AI: state space search and local search.\n\n#### State space search\n\nState space search searches through a tree of possible states to try to find a goal state.[70] For example, planning algorithms search through trees of goals and subgoals, attempting to find a path to a target goal, a process called means-ends analysis.[71]\n\nSimple exhaustive searches[72] are rarely sufficient for most real-world problems: the search space (the number of places to search) quickly grows to astronomical numbers. The result is a search that is too slow or never completes.[15] \"Heuristics\" or \"rules of thumb\" can help prioritize choices that are more likely to reach a goal.[73]\n\nAdversarial search is used for game-playing programs, such as chess or Go. It searches through a tree of possible moves and countermoves, looking for a winning position.[74]\n\n#### Local search\n\nIllustration of gradient descent for 3 different starting points; two parameters (represented by the plan coordinates) are adjusted in order to minimize the loss function (the height)\n\nLocal search uses mathematical optimization to find a solution to a problem. It begins with some form of guess and refines it incrementally.[75]\n\nGradient descent is a type of local search that optimizes a set of numerical parameters by incrementally adjusting them to minimize a loss function. Variants of gradient descent are commonly used to train neural networks,[76] through the backpropagation algorithm.\n\nAnother type of local search is evolutionary computation, which aims to iteratively improve a set of candidate solutions by \"mutating\" and \"recombining\" them, selecting only the fittest to survive each generation.[77]\n\nDistributed search processes can coordinate via swarm intelligence algorithms. Two popular swarm algorithms used in search are particle swarm optimization (inspired by bird flocking) and ant colony optimization (inspired by ant trails).[78]\n\n### Logic\n\nFormal logic is used for reasoning and knowledge representation.[79]\nFormal logic comes in two main forms: propositional logic (which operates on statements that are true or false and uses logical connectives such as \"and\", \"or\", \"not\" and \"implies\")[80] and predicate logic (which also operates on objects, predicates and relations and uses quantifiers such as \"Every X is a Y\" and \"There are some Xs that are Ys\").[81]\n\nDeductive reasoning in logic is the process of proving a new statement (conclusion) from other statements that are given and assumed to be true (the premises).[82] Proofs can be structured as proof trees, in which nodes are labelled by sentences, and children nodes are connected to parent nodes by inference rules.\n\nGiven a problem and a set of premises, problem-solving reduces to searching for a proof tree whose root node is labelled by a solution of the problem and whose leaf nodes are labelled by premises or axioms. In the case of Horn clauses, problem-solving search can be performed by reasoning forwards from the premises or backwards from the problem.[83] In the more general case of the clausal form of first-order logic, resolution is a single, axiom-free rule of inference, in which a problem is solved by proving a contradiction from premises that include the negation of the problem to be solved.[84]\n\nInference in both Horn clause logic and first-order logic is undecidable, and therefore intractable. However, backward reasoning with Horn clauses, which underpins computation in the logic programming language Prolog, is Turing complete. Moreover, its efficiency is competitive with computation in other symbolic programming languages.[85]\n\nFuzzy logic assigns a \"degree of truth\" between 0 and 1. It can therefore handle propositions that are vague and partially true.[86]\n\nNon-monotonic logics, including logic programming with negation as failure, are designed to handle default reasoning.[28] Other specialized versions of logic have been developed to describe many complex domains.\n\n### Probabilistic methods for uncertain reasoning\n\nA simple Bayesian network, with the associated conditional probability tables\n\nMany problems in AI (including reasoning, planning, learning, perception, and robotics) require the agent to operate with incomplete or uncertain information. AI researchers have devised a number of tools to solve these problems using methods from probability theory and economics.[87] Precise mathematical tools have been developed that analyze how an agent can make choices and plan, using decision theory, decision analysis,[88] and information value theory.[89] These tools include models such as Markov decision processes,[90] dynamic decision networks,[91] game theory and mechanism design.[92]\n\nBayesian networks[93] are a tool that can be used for reasoning (using the Bayesian inference algorithm),[g][95] learning (using the expectation-maximization algorithm),[h][97] planning (using decision networks)[98] and perception (using dynamic Bayesian networks).[91]\n\nProbabilistic algorithms can also be used for filtering, prediction, smoothing, and finding explanations for streams of data, thus helping perception systems analyze processes that occur over time (e. g., hidden Markov models or Kalman filters).[91]\n\nExpectation-maximization clustering of Old Faithful eruption data starts from a random guess but then successfully converges on an accurate clustering of the two physically distinct modes of eruption.\n\n### Classifiers and statistical learning methods\n\nThe simplest AI applications can be divided into two types: classifiers (e. g., \"if shiny then diamond\"), on one hand, and controllers (e. g., \"if diamond then pick up\"), on the other hand. Classifiers[99] are functions that use pattern matching to determine the closest match. They can be fine-tuned based on chosen examples using supervised learning. Each pattern (also called an \"observation\") is labeled with a certain predefined class. All the observations combined with their class labels are known as a data set. When a new observation is received, that observation is classified based on previous experience.[45]\n\nThere are many kinds of classifiers in use.[100] The decision tree is the simplest and most widely used symbolic machine learning algorithm.[101] K-nearest neighbor algorithm was the most widely used analogical AI until the mid-1990s, and Kernel methods such as the support vector machine (SVM) displaced k-nearest neighbor in the 1990s.[102]\nThe naive Bayes classifier is reportedly the \"most widely used learner\"[103] at Google, due in part to its scalability.[104]\nNeural networks are also used as classifiers.[105]\n\n### Artificial neural networks\n\nA neural network is an interconnected group of nodes, akin to the vast network of neurons in the human brain.\n\nAn artificial neural network is based on a collection of nodes also known as artificial neurons, which loosely model the neurons in a biological brain. It is trained to recognise patterns; once trained, it can recognise those patterns in fresh data. There is an input, at least one hidden layer of nodes and an output. Each node applies a function and once the weight crosses its specified threshold, the data is transmitted to the next layer. A network is typically called a deep neural network if it has at least 2 hidden layers.[105]\n\nLearning algorithms for neural networks use local search to choose the weights that will get the right output for each input during training. The most common training technique is the backpropagation algorithm.[106] Neural networks learn to model complex relationships between inputs and outputs and find patterns in data. In theory, a neural network can learn any function.[107]\n\nIn feedforward neural networks the signal passes in only one direction.[108] The term perceptron typically refers to a single-layer neural network.[109] In contrast, deep learning uses many layers.[110] Recurrent neural networks (RNNs) feed the output signal back into the input, which allows short-term memories of previous input events. Long short-term memory networks (LSTMs) are recurrent neural networks that better preserve longterm dependencies and are less sensitive to the vanishing gradient problem.[111] Convolutional neural networks (CNNs) use layers of kernels to more efficiently process local patterns. This local processing is especially important in image processing, where the early CNN layers typically identify simple local patterns such as edges and curves, with subsequent layers detecting more complex patterns like textures, and eventually whole objects.[112]\n\n### Deep learning\n\nDeep learning is a subset of machine learning, which is itself a subset of artificial intelligence.[113]\n\nDeep learning uses several layers of neurons between the network's inputs and outputs.[110] The multiple layers can progressively extract higher-level features from the raw input. For example, in image processing, lower layers may identify edges, while higher layers may identify the concepts relevant to a human such as digits, letters, or faces.[114]\n\nDeep learning has profoundly improved the performance of programs in many important subfields of artificial intelligence, including computer vision, speech recognition, natural language processing, image classification,[115] and others. The reason that deep learning performs so well in so many applications is not known as of 2021.[116] The sudden success of deep learning in 2012-2015 did not occur because of some new discovery or theoretical breakthrough (deep neural networks and backpropagation had been described by many people, as far back as the 1950s)[i] but because of two factors: the incredible increase in computer power (including the hundred-fold increase in speed by switching to GPUs) and the availability of vast amounts of training data, especially the giant curated datasets used for benchmark testing, such as ImageNet.[j]\n\n### GPT\n\nGenerative pre-trained transformers (GPT) are large language models (LLMs) that generate text based on the semantic relationships between words in sentences. Text-based GPT models are pre-trained on a large corpus of text that can be from the Internet. The pretraining consists of predicting the next token (a token being usually a word, subword, or punctuation). Throughout this pretraining, GPT models accumulate knowledge about the world and can then generate human-like text by repeatedly predicting the next token. Typically, a subsequent training phase makes the model more truthful, useful, and harmless, usually with a technique called reinforcement learning from human feedback (RLHF). Current GPT models are prone to generating falsehoods called \"hallucinations\". These can be reduced with RLHF and quality data, but the problem has been getting worse for reasoning systems.[124] Such systems are used in chatbots, which allow people to ask a question or request a task in simple text.[125][126]\n\nCurrent models and services include ChatGPT, Claude, Gemini, Copilot, and Meta AI.[127] Multimodal GPT models can process different types of data (modalities) such as images, videos, sound, and text.[128]\n\n### Hardware and software\n\nMain articles: Programming languages for artificial intelligence and Hardware for artificial intelligence\n\nRaspberry Pi AI Kit\n\nIn the late 2010s, graphics processing units (GPUs) that were increasingly designed with AI-specific enhancements and used with specialized TensorFlow software had replaced previously used central processing unit (CPUs) as the dominant means for large-scale (commercial and academic) machine learning models' training.[129] Specialized programming languages such as Prolog were used in early AI research,[130] but general-purpose programming languages like Python have become predominant.[131]\n\nThe transistor density in integrated circuits has been observed to roughly double every 18 months-a trend known as Moore's law, named after the Intel co-founder Gordon Moore, who first identified it. Improvements in GPUs have been even faster,[132] a trend sometimes called Huang's law,[133] named after Nvidia co-founder and CEO Jensen Huang.\n\n## Applications\n\nMain article: Applications of artificial intelligence\n\nAI and machine learning technology is used in most of the essential applications of the 2020s, including:\n\n• search engines (such as Google Search)\n\n• targeting online advertisements\n\n• recommendation systems (offered by Netflix, YouTube or Amazon) driving internet traffic\n\n• targeted advertising (AdSense, Facebook)\n\n• virtual assistants (such as Siri or Alexa)\n\n• autonomous vehicles (including drones, ADAS and self-driving cars)\n\n• automatic language translation (Microsoft Translator, Google Translate)\n\n• facial recognition (Apple's FaceID or Microsoft's DeepFace and Google's FaceNet)\n\n• image labeling (used by Facebook, Apple's Photos and TikTok).\n\nThe deployment of AI may be overseen by a chief automation officer (CAO).\n\n### Health and medicine\n\nMain article: Artificial intelligence in healthcare\n\nIt has been suggested that AI can overcome discrepancies in funding allocated to different fields of research.[134]\n\nAlphaFold 2 (2021) demonstrated the ability to approximate, in hours rather than months, the 3D structure of a protein.[135] In 2023, it was reported that AI-guided drug discovery helped find a class of antibiotics capable of killing two different types of drug-resistant bacteria.[136] In 2024, researchers used machine learning to accelerate the search for Parkinson's disease drug treatments. Their aim was to identify compounds that block the clumping, or aggregation, of alpha-synuclein (the protein that characterises Parkinson's disease). They were able to speed up the initial screening process ten-fold and reduce the cost by a thousand-fold.[137][138]\n\n### Gaming\n\nMain article: Artificial intelligence in video games\n\nGame playing programs have been used since the 1950s to demonstrate and test AI's most advanced techniques.[139] Deep Blue became the first computer chess-playing system to beat a reigning world chess champion, Garry Kasparov, on 11 May 1997.[140] In 2011, in a Jeopardy! quiz show exhibition match, IBM's question answering system, Watson, defeated the two greatest Jeopardy! champions, Brad Rutter and Ken Jennings, by a significant margin.[141] In March 2016, AlphaGo won 4 out of 5 games of Go in a match with Go champion Lee Sedol, becoming the first computer Go-playing system to beat a professional Go player without handicaps. Then, in 2017, it defeated Ke Jie, who was the best Go player in the world.[142] Other programs handle imperfect-information games, such as the poker-playing program Pluribus.[143] DeepMind developed increasingly generalistic reinforcement learning models, such as with MuZero, which could be trained to play chess, Go, or Atari games.[144] In 2019, DeepMind's AlphaStar achieved grandmaster level in StarCraft II, a particularly challenging real-time strategy game that involves incomplete knowledge of what happens on the map.[145] In 2021, an AI agent competed in a PlayStation Gran Turismo competition, winning against four of the world's best Gran Turismo drivers using deep reinforcement learning.[146] In 2024, Google DeepMind introduced SIMA, a type of AI capable of autonomously playing nine previously unseen open-world video games by observing screen output, as well as executing short, specific tasks in response to natural language instructions.[147]\n\n### Mathematics\n\nLarge language models, such as GPT-4, Gemini, Claude, Llama or Mistral, are increasingly used in mathematics. These probabilistic models are versatile, but can also produce wrong answers in the form of hallucinations. They sometimes need a large database of mathematical problems to learn from, but also methods such as supervised fine-tuning[148] or trained classifiers with human-annotated data to improve answers for new problems and learn from corrections.[149] A February 2024 study showed that the performance of some language models for reasoning capabilities in solving math problems not included in their training data was low, even for problems with only minor deviations from trained data.[150] One technique to improve their performance involves training the models to produce correct reasoning steps, rather than just the correct result.[151] The Alibaba Group developed a version of its Qwen models called Qwen2-Math, that achieved state-of-the-art performance on several mathematical benchmarks, including 84% accuracy on the MATH dataset of competition mathematics problems.[152] In January 2025, Microsoft proposed the technique rStar-Math that leverages Monte Carlo tree search and step-by-step reasoning, enabling a relatively small language model like Qwen-7B to solve 53% of the AIME 2024 and 90% of the MATH benchmark problems.[153]\n\nAlternatively, dedicated models for mathematical problem solving with higher precision for the outcome including proof of theorems have been developed such as AlphaTensor, AlphaGeometry, AlphaProof and AlphaEvolve[154] all from Google DeepMind,[155] Llemma from EleutherAI[156] or Julius.[157]\n\nWhen natural language is used to describe mathematical problems, converters can transform such prompts into a formal language such as Lean to define mathematical tasks. The experimental model Gemini Deep Think accepts natural language prompts directly and achieved gold medal results in the International Math Olympiad of 2025.[158]\n\nSome models have been developed to solve challenging problems and reach good results in benchmark tests, others to serve as educational tools in mathematics.[159]\n\nTopological deep learning integrates various topological approaches.\n\n### Finance\n\nFinance is one of the fastest growing sectors where applied AI tools are being deployed: from retail online banking to investment advice and insurance, where automated \"robot advisers\" have been in use for some years.[160]\n\nAccording to Nicolas Firzli, director of the World Pensions & Investments Forum, it may be too early to see the emergence of highly innovative AI-informed financial products and services. He argues that \"the deployment of AI tools will simply further automatise things: destroying tens of thousands of jobs in banking, financial planning, and pension advice in the process, but I'm not sure it will unleash a new wave of [e. g., sophisticated] pension innovation.\"[161]\n\n### Military\n\nMain article: Military applications of artificial intelligence\n\nVarious countries are deploying AI military applications.[162] The main applications enhance command and control, communications, sensors, integration and interoperability.[163] Research is targeting intelligence collection and analysis, logistics, cyber operations, information operations, and semiautonomous and autonomous vehicles.[162] AI technologies enable coordination of sensors and effectors, threat detection and identification, marking of enemy positions, target acquisition, coordination and deconfliction of distributed Joint Fires between networked combat vehicles, both human-operated and autonomous.[163]\n\nAI has been used in military operations in Iraq, Syria, Israel and Ukraine.[162][164][165][166]\n\n### Generative AI\n\nVincent van Gogh in watercolour created by generative AI software\n\nThese paragraphs are an excerpt from Generative artificial intelligence.[edit]\n\nGenerative artificial intelligence, also known as generative AI or GenAI, is a subfield of artificial intelligence that uses generative models to generate text, images, videos, audio, software code or other forms of data.[167]\nThese models learn the underlying patterns and structures of their training data and use them to generate new data[168]\nin response to input, which often takes the form of natural language prompts.[169][170]\nThe generated material is often called AIGC (AI Generated Content).[citation needed]\n\nThe prevalence of generative AI tools has increased significantly since the AI boom in the 2020s. This boom was made possible by improvements in deep neural networks, particularly large language models (LLMs), which are based on the transformer architecture. Generative AI applications include chatbots such as ChatGPT, Claude, Copilot, DeepSeek, Google Gemini and Grok; text-to-image models such as Stable Diffusion, Midjourney, and DALL-E; and text-to-video models such as Veo, LTX and Sora.[171][172][173]\n\nCompanies in a variety of sectors have used generative AI, including those in software development, healthcare,[174] finance,[175] entertainment,[176] customer service,[177] sales and marketing,[178] art, writing,[179] and product design.[180]\n\n### Agents\n\nMain article: Agentic AI\n\nAI agents are software entities designed to perceive their environment, make decisions, and take actions autonomously to achieve specific goals. These agents can interact with users, their environment, or other agents. AI agents are used in various applications, including virtual assistants, chatbots, autonomous vehicles, game-playing systems, and industrial robotics. AI agents operate within the constraints of their programming, available computational resources, and hardware limitations. This means they are restricted to performing tasks within their defined scope and have finite memory and processing capabilities. In real-world applications, AI agents often face time constraints for decision-making and action execution. Many AI agents incorporate learning algorithms, enabling them to improve their performance over time through experience or training. Using machine learning, AI agents can adapt to new situations and optimise their behaviour for their designated tasks.[181][182][183]\n\n### Web search\n\nMicrosoft introduced Copilot Search in February 2023 under the name Bing Chat, as a built-in feature for Microsoft Edge and Bing mobile app. Copilot Search provides AI-generated summaries[184] and step-by-step reasoning based of information from web publishers, ranked in Bing Search.[185]\nFor safety, Copilot uses AI-based classifiers and filters to reduce potentially harmful content.[186]\n\nGoogle officially pushed its AI Search at its Google I/O event on 20 May 2025.[187] It keeps people looking at Google instead of clicking on a search result. AI Overviews uses Gemini 2.5 to provide contextual answers to user queries based on web content.[188]\n\n### Sexuality\n\nApplications of AI in this domain include AI-enabled menstruation and fertility trackers that analyze user data to offer predictions,[189] AI-integrated sex toys (e. g., teledildonics),[190] AI-generated sexual education content,[191] and AI agents that simulate sexual and romantic partners (e. g., Replika).[192] AI is also used for the production of non-consensual deepfake pornography, raising significant ethical and legal concerns.[193]\n\nAI technologies have also been used to attempt to identify online gender-based violence and online sexual grooming of minors.[194][195]\n\n### Other industry-specific tasks\n\nThere are also thousands of successful AI applications used to solve specific problems for specific industries or institutions. In a 2017 survey, one in five companies reported having incorporated \"AI\" in some offerings or processes.[196] A few examples are energy storage, medical diagnosis, military logistics, applications that predict the result of judicial decisions, foreign policy, or supply chain management.\n\nAI applications for evacuation and disaster management are growing. AI has been used to investigate patterns in large-scale and small-scale evacuations using historical data from GPS, videos or social media. Furthermore, AI can provide real-time information on the evacuation conditions.[197][198][199]\n\nIn agriculture, AI has helped farmers to increase yield and identify areas that need irrigation, fertilization, pesticide treatments. Agronomists use AI to conduct research and development. AI has been used to predict the ripening time for crops such as tomatoes, monitor soil moisture, operate agricultural robots, conduct predictive analytics, classify livestock pig call emotions, automate greenhouses, detect diseases and pests, and save water.\n\nArtificial intelligence is used in astronomy to analyze increasing amounts of available data and applications, mainly for \"classification, regression, clustering, forecasting, generation, discovery, and the development of new scientific insights.\" For example, it is used for discovering exoplanets, forecasting solar activity, and distinguishing between signals and instrumental effects in gravitational wave astronomy. Additionally, it could be used for activities in space, such as space exploration, including the analysis of data from space missions, real-time science decisions of spacecraft, space debris avoidance, and more autonomous operation.\n\nDuring the 2024 Indian elections, US$50 million was spent on authorized AI-generated content, notably by creating deepfakes of allied (including sometimes deceased) politicians to better engage with voters, and by translating speeches to various local languages.[200]\n\n## Ethics\n\nMain article: Ethics of artificial intelligence\n\nStreet art in Tel Aviv[201][202]\n\nAI has potential benefits and potential risks.[203] AI may be able to advance science and find solutions for serious problems: Demis Hassabis of DeepMind hopes to \"solve intelligence, and then use that to solve everything else\".[204] However, as the use of AI has become widespread, several unintended consequences and risks have been identified.[205][206] In-production systems can sometimes not factor ethics and bias into their AI training processes, especially when the AI algorithms are inherently unexplainable in deep learning.[207]\n\n### Risks and harm\n\n#### Privacy and copyright\n\nFurther information: Information privacy and Artificial intelligence and copyright\n\nMachine learning algorithms require large amounts of data. The techniques used to acquire this data have raised concerns about privacy, surveillance and copyright.\n\nAI-powered devices and services, such as virtual assistants and IoT products, continuously collect personal information, raising concerns about intrusive data gathering and unauthorized access by third parties. The loss of privacy is further exacerbated by AI's ability to process and combine vast amounts of data, potentially leading to a surveillance society where individual activities are constantly monitored and analyzed without adequate safeguards or transparency.\n\nSensitive user data collected may include online activity records, geolocation data, video, or audio.[208] For example, in order to build speech recognition algorithms, Amazon has recorded millions of private conversations and allowed temporary workers to listen to and transcribe some of them.[209] Opinions about this widespread surveillance range from those who see it as a necessary evil to those for whom it is clearly unethical and a violation of the right to privacy.[210]\n\nAI developers argue that this is the only way to deliver valuable applications and have developed several techniques that attempt to preserve privacy while still obtaining the data, such as data aggregation, de-identification and differential privacy.[211] Since 2016, some privacy experts, such as Cynthia Dwork, have begun to view privacy in terms of fairness. Brian Christian wrote that experts have pivoted \"from the question of 'what they know' to the question of 'what they're doing with it'.\"[212]\n\nGenerative AI is often trained on unlicensed copyrighted works, including in domains such as images or computer code; the output is then used under the rationale of \"fair use\". Experts disagree about how well and under what circumstances this rationale will hold up in courts of law; relevant factors may include \"the purpose and character of the use of the copyrighted work\" and \"the effect upon the potential market for the copyrighted work\".[213][214] Website owners can indicate that they do not want their content scraped via a \"robots. txt\" file.[215] However, some companies will scrape content regardless[216][217] because the robots. txt file has no real authority. In 2023, leading authors (including John Grisham and Jonathan Franzen) sued AI companies for using their work to train generative AI.[218][219] Another discussed approach is to envision a separate sui generis system of protection for creations generated by AI to ensure fair attribution and compensation for human authors.[220]\n\n#### Dominance by tech giants\n\nThe commercial AI scene is dominated by Big Tech companies such as Alphabet Inc., Amazon, Apple Inc., Meta Platforms, and Microsoft.[221][222][223] Some of these players already own the vast majority of existing cloud infrastructure and computing power from data centers, allowing them to entrench further in the marketplace.[224][225]\n\n#### Power needs and environmental impacts\n\nSee also: Environmental impacts of artificial intelligence\n\nFueled by growth in artificial intelligence, data centers' demand for power increased in the 2020s.[226]\n\nIn January 2024, the International Energy Agency (IEA) released Electricity 2024, Analysis and Forecast to 2026, forecasting electric power use.[227] This is the first IEA report to make projections for data centers and power consumption for artificial intelligence and cryptocurrency. The report states that power demand for these uses might double by 2026, with additional electric power usage equal to electricity used by the whole Japanese nation.[228]\n\nProdigious power consumption by AI is responsible for the growth of fossil fuel use, and might delay closings of obsolete, carbon-emitting coal energy facilities. There is a feverish rise in the construction of data centers throughout the US, making large technology firms (e. g., Microsoft, Meta, Google, Amazon) into voracious consumers of electric power. Projected electric consumption is so immense that there is concern that it will be fulfilled no matter the source. A ChatGPT search involves the use of 10 times the electrical energy as a Google search. The large firms are in haste to find power sources - from nuclear energy to geothermal to fusion. The tech firms argue that - in the long view - AI will be eventually kinder to the environment, but they need the energy now. AI makes the power grid more efficient and \"intelligent\", will assist in the growth of nuclear power, and track overall carbon emissions, according to technology firms.[229]\n\nA 2024 Goldman Sachs Research Paper, AI Data Centers and the Coming US Power Demand Surge, found \"US power demand (is) likely to experience growth not seen in a generation....\" and forecasts that, by 2030, US data centers will consume 8% of US power, as opposed to 3% in 2022, presaging growth for the electrical power generation industry by a variety of means.[230] Data centers' need for more and more electrical power is such that they might max out the electrical grid. The Big Tech companies counter that AI can be used to maximize the utilization of the grid by all.[231]\n\nIn 2024, the Wall Street Journal reported that big AI companies have begun negotiations with the US nuclear power providers to provide electricity to the data centers. In March 2024 Amazon purchased a Pennsylvania nuclear-powered data center for US$650 million.[232] Nvidia CEO Jensen Huang said nuclear power is a good option for the data centers.[233]\n\nIn September 2024, Microsoft announced an agreement with Constellation Energy to re-open the Three Mile Island nuclear power plant to provide Microsoft with 100% of all electric power produced by the plant for 20 years. Reopening the plant, which suffered a partial nuclear meltdown of its Unit 2 reactor in 1979, will require Constellation to get through strict regulatory processes which will include extensive safety scrutiny from the US Nuclear Regulatory Commission. If approved (this will be the first ever US re-commissioning of a nuclear plant), over 835 megawatts of power - enough for 800,000 homes - of energy will be produced. The cost for re-opening and upgrading is estimated at US$1.6 billion and is dependent on tax breaks for nuclear power contained in the 2022 US Inflation Reduction Act.[234] The US government and the state of Michigan are investing almost US$2 billion to reopen the Palisades Nuclear reactor on Lake Michigan. Closed since 2022, the plant is planned to be reopened in October 2025. The Three Mile Island facility will be renamed the Crane Clean Energy Center after Chris Crane, a nuclear proponent and former CEO of Exelon who was responsible for Exelon's spinoff of Constellation.[235]\n\nAfter the last approval in September 2023, Taiwan suspended the approval of data centers north of Taoyuan with a capacity of more than 5 MW in 2024, due to power supply shortages.[236] Taiwan aims to phase out nuclear power by 2025.[236] On the other hand, Singapore imposed a ban on the opening of data centers in 2019 due to electric power, but in 2022, lifted this ban.[236]\n\nAlthough most nuclear plants in Japan have been shut down after the 2011 Fukushima nuclear accident, according to an October 2024 Bloomberg article in Japanese, cloud gaming services company Ubitus, in which Nvidia has a stake, is looking for land in Japan near a nuclear power plant for a new data center for generative AI.[237] Ubitus CEO Wesley Kuo said nuclear power plants are the most efficient, cheap and stable power for AI.[237]\n\nOn 1 November 2024, the Federal Energy Regulatory Commission (FERC) rejected an application submitted by Talen Energy for approval to supply some electricity from the nuclear power station Susquehanna to Amazon's data center.[238]\nAccording to the Commission Chairman Willie L. Phillips, it is a burden on the electricity grid as well as a significant cost shifting concern to households and other business sectors.[238]\n\nIn 2025, a report prepared by the International Energy Agency estimated the greenhouse gas emissions from the energy consumption of AI at 180 million tons. By 2035, these emissions could rise to 300-500 million tonnes depending on what measures will be taken. This is below 1.5% of the energy sector emissions. The emissions reduction potential of AI was estimated at 5% of the energy sector emissions, but rebound effects (for example if people switch from public transport to autonomous cars) can reduce it.[239]\n\n#### Misinformation\n\nSee also: Content moderation\n\nYouTube, Facebook and others use recommender systems to guide users to more content. These AI programs were given the goal of maximizing user engagement (that is, the only goal was to keep people watching). The AI learned that users tended to choose misinformation, conspiracy theories, and extreme partisan content, and, to keep them watching, the AI recommended more of it. Users also tended to watch more content on the same subject, so the AI led people into filter bubbles where they received multiple versions of the same misinformation.[240] This convinced many users that the misinformation was true, and ultimately undermined trust in institutions, the media and the government.[241] The AI program had correctly learned to maximize its goal, but the result was harmful to society. After the U. S. election in 2016, major technology companies took some steps to mitigate the problem.[242]\n\nIn the early 2020s, generative AI began to create images, audio, and texts that are virtually indistinguishable from real photographs, recordings, or human writing,[243] while realistic AI-generated videos became feasible in the mid-2020s.[244][245][246] It is possible for bad actors to use this technology to create massive amounts of misinformation or propaganda;[247] one such potential malicious use is deepfakes for computational propaganda.[248] AI pioneer and Nobel Prize-winning computer scientist Geoffrey Hinton expressed concern about AI enabling \"authoritarian leaders to manipulate their electorates\" on a large scale, among other risks.[249] The ability to influence electorates has been proved in at least one study. This same study shows more inaccurate statements from the models when they advocate for candidates of the political right.[250]\n\nAI researchers at Microsoft, OpenAI, universities and other organisations have suggested using \"personhood credentials\" as a way to overcome online deception enabled by AI models.[251]\n\n#### Algorithmic bias and fairness\n\nMain articles: Algorithmic bias and Fairness (machine learning)\n\nMachine learning applications can be biased[k] if they learn from biased data.[253] The developers may not be aware that the bias exists.[254] Discriminatory behavior by some LLMs can be observed in their output.[255] Bias can be introduced by the way training data is selected and by the way a model is deployed.[256][253] If a biased algorithm is used to make decisions that can seriously harm people (as it can in medicine, finance, recruitment, housing or policing) then the algorithm may cause discrimination.[257] The field of fairness studies how to prevent harms from algorithmic biases.\n\nOn 28 June 2015, Google Photos's new image labeling feature mistakenly identified Jacky Alcine and a friend as \"gorillas\" because they were black. The system was trained on a dataset that contained very few images of black people,[258] a problem called \"sample size disparity\".[259] Google \"fixed\" this problem by preventing the system from labelling anything as a \"gorilla\". Eight years later, in 2023, Google Photos still could not identify a gorilla, and neither could similar products from Apple, Facebook, Microsoft and Amazon.[260]\n\nCOMPAS is a commercial program widely used by U. S. courts to assess the likelihood of a defendant becoming a recidivist. In 2016, Julia Angwin at ProPublica discovered that COMPAS exhibited racial bias, despite the fact that the program was not told the races of the defendants. Although the error rate for both whites and blacks was calibrated equal at exactly 61%, the errors for each race were different-the system consistently overestimated the chance that a black person would re-offend and would underestimate the chance that a white person would not re-offend.[261] In 2017, several researchers[l] showed that it was mathematically impossible for COMPAS to accommodate all possible measures of fairness when the base rates of re-offense were different for whites and blacks in the data.[263]\n\nA program can make biased decisions even if the data does not explicitly mention a problematic feature (such as \"race\" or \"gender\"). The feature will correlate with other features (like \"address\", \"shopping history\" or \"first name\"), and the program will make the same decisions based on these features as it would on \"race\" or \"gender\".[264] Moritz Hardt said \"the most robust fact in this research area is that fairness through blindness doesn't work.\"[265]\n\nCriticism of COMPAS highlighted that machine learning models are designed to make \"predictions\" that are only valid if we assume that the future will resemble the past. If they are trained on data that includes the results of racist decisions in the past, machine learning models must predict that racist decisions will be made in the future. If an application then uses these predictions as recommendations, some of these \"recommendations\" will likely be racist.[266] Thus, machine learning is not well suited to help make decisions in areas where there is hope that the future will be better than the past. It is descriptive rather than prescriptive.[m]\n\nBias and unfairness may go undetected because the developers are overwhelmingly white and male: among AI engineers, about 4% are black and 20% are women.[259]\n\nThere are various conflicting definitions and mathematical models of fairness. These notions depend on ethical assumptions, and are influenced by beliefs about society. One broad category is distributive fairness, which focuses on the outcomes, often identifying groups and seeking to compensate for statistical disparities. Representational fairness tries to ensure that AI systems do not reinforce negative stereotypes or render certain groups invisible. Procedural fairness focuses on the decision process rather than the outcome. The most relevant notions of fairness may depend on the context, notably the type of AI application and the stakeholders. The subjectivity in the notions of bias and fairness makes it difficult for companies to operationalize them. Having access to sensitive attributes such as race or gender is also considered by many AI ethicists to be necessary in order to compensate for biases, but it may conflict with anti-discrimination laws.[252]\n\nAt the 2022 ACM Conference on Fairness, Accountability, and Transparency a paper reported that a CLIP-based (Contrastive Language-Image Pre-training) robotic system reproduced harmful gender- and race-linked stereotypes in a simulated manipulation task. The authors recommended robot-learning methods which physically manifest such harms be \"paused, reworked, or even wound down when appropriate, until outcomes can be proven safe, effective, and just.\"[268][269][270]\n\n#### Lack of transparency\n\nSee also: Explainable AI, Algorithmic transparency, and Right to explanation\n\nMany AI systems are so complex that their designers cannot explain how they reach their decisions.[271] Particularly with deep neural networks, in which there are many non-linear relationships between inputs and outputs. But some popular explainability techniques exist.[272]\n\nIt is impossible to be certain that a program is operating correctly if no one knows how exactly it works. There have been many cases where a machine learning program passed rigorous tests, but nevertheless learned something different than what the programmers intended. For example, a system that could identify skin diseases better than medical professionals was found to actually have a strong tendency to classify images with a ruler as \"cancerous\", because pictures of malignancies typically include a ruler to show the scale.[273] Another machine learning system designed to help effectively allocate medical resources was found to classify patients with asthma as being at \"low risk\" of dying from pneumonia. Having asthma is actually a severe risk factor, but since the patients having asthma would usually get much more medical care, they were relatively unlikely to die according to the training data. The correlation between asthma and low risk of dying from pneumonia was real, but misleading.[274]\n\nPeople who have been harmed by an algorithm's decision have a right to an explanation.[275] Doctors, for example, are expected to clearly and completely explain to their colleagues the reasoning behind any decision they make. Early drafts of the European Union's General Data Protection Regulation in 2016 included an explicit statement that this right exists.[n] Industry experts noted that this is an unsolved problem with no solution in sight. Regulators argued that nevertheless the harm is real: if the problem has no solution, the tools should not be used.[276]\n\nDARPA established the XAI (\"Explainable Artificial Intelligence\") program in 2014 to try to solve these problems.[277]\n\nSeveral approaches aim to address the transparency problem. SHAP enables to visualise the contribution of each feature to the output.[278] LIME can locally approximate a model's outputs with a simpler, interpretable model.[279] Multitask learning provides a large number of outputs in addition to the target classification. These other outputs can help developers deduce what the network has learned.[280] Deconvolution, DeepDream and other generative methods can allow developers to see what different layers of a deep network for computer vision have learned, and produce output that can suggest what the network is learning.[281] For generative pre-trained transformers, Anthropic developed a technique based on dictionary learning that associates patterns of neuron activations with human-understandable concepts.[282]\n\n#### Bad actors and weaponized AI\n\nMain articles: Lethal autonomous weapon, Artificial intelligence arms race, and AI safety\n\nArtificial intelligence provides a number of tools that are useful to bad actors, such as authoritarian governments, terrorists, criminals or rogue states.\n\nA lethal autonomous weapon is a machine that locates, selects and engages human targets without human supervision.[o] Widely available AI tools can be used by bad actors to develop inexpensive autonomous weapons and, if produced at scale, they are potentially weapons of mass destruction.[284] Even when used in conventional warfare, they currently cannot reliably choose targets and could potentially kill an innocent person.[284] In 2014, 30 nations (including China) supported a ban on autonomous weapons under the United Nations' Convention on Certain Conventional Weapons, however the United States and others disagreed.[285] By 2015, over fifty countries were reported to be researching battlefield robots.[286]\n\nAI tools make it easier for authoritarian governments to efficiently control their citizens in several ways. Face and voice recognition allow widespread surveillance. Machine learning, operating this data, can classify potential enemies of the state and prevent them from hiding. Recommendation systems can precisely target propaganda and misinformation for maximum effect. Deepfakes and generative AI aid in producing misinformation. Advanced AI can make authoritarian centralized decision-making more competitive than liberal and decentralized systems such as markets. It lowers the cost and difficulty of digital warfare and advanced spyware.[287] All these technologies have been available since 2020 or earlier-AI facial recognition systems are already being used for mass surveillance in China.[288][289]\n\nThere are many other ways in which AI is expected to help bad actors, some of which can not be foreseen. For example, machine-learning AI is able to design tens of thousands of toxic molecules in a matter of hours.[290]\n\n#### Technological unemployment\n\nMain articles: Workplace impact of artificial intelligence and Technological unemployment\n\nEconomists have frequently highlighted the risks of redundancies from AI, and speculated about unemployment if there is no adequate social policy for full employment.[291]\n\nIn the past, technology has tended to increase rather than reduce total employment, but economists acknowledge that \"we're in uncharted territory\" with AI.[292] A survey of economists showed disagreement about whether the increasing use of robots and AI will cause a substantial increase in long-term unemployment, but they generally agree that it could be a net benefit if productivity gains are redistributed.[293] Risk estimates vary; for example, in the 2010s, Michael Osborne and Carl Benedikt Frey estimated 47% of U. S. jobs are at \"high risk\" of potential automation, while an OECD report classified only 9% of U. S. jobs as \"high risk\".[p][295] The methodology of speculating about future employment levels has been criticised as lacking evidential foundation, and for implying that technology, rather than social policy, creates unemployment, as opposed to redundancies.[291] In April 2023, it was reported that 70% of the jobs for Chinese video game illustrators had been eliminated by generative artificial intelligence.[296][297]\n\nUnlike previous waves of automation, many middle-class jobs may be eliminated by artificial intelligence; The Economist stated in 2015 that \"the worry that AI could do to white-collar jobs what steam power did to blue-collar ones during the Industrial Revolution\" is \"worth taking seriously\".[298] Jobs at extreme risk range from paralegals to fast food cooks, while job demand is likely to increase for care-related professions ranging from personal healthcare to the clergy.[299] In July 2025, Ford CEO Jim Farley predicted that \"artificial intelligence is going to replace literally half of all white-collar workers in the U. S.\"[300]\n\nFrom the early days of the development of artificial intelligence, there have been arguments, for example, those put forward by Joseph Weizenbaum, about whether tasks that can be done by computers actually should be done by them, given the difference between computers and humans, and between quantitative calculation and qualitative, value-based judgement.[301]\n\n#### Existential risk\n\nMain article: Existential risk from artificial intelligence\n\nRecent public debates in artificial intelligence have increasingly focused on its broader societal and ethical implications. It has been argued AI will become so powerful that humanity may irreversibly lose control of it. This could, as physicist Stephen Hawking stated, \"spell the end of the human race\".[302] This scenario has been common in science fiction, when a computer or robot suddenly develops a human-like \"self-awareness\" (or \"sentience\" or \"consciousness\") and becomes a malevolent character.[q] These sci-fi scenarios are misleading in several ways.\n\nFirst, AI does not require human-like sentience to be an existential risk. Modern AI programs are given specific goals and use learning and intelligence to achieve them. Philosopher Nick Bostrom argued that if one gives almost any goal to a sufficiently powerful AI, it may choose to destroy humanity to achieve it (he used the example of an automated paperclip factory that destroys the world to get more iron for paperclips).[304] Stuart Russell gives the example of household robot that tries to find a way to kill its owner to prevent it from being unplugged, reasoning that \"you can't fetch the coffee if you're dead.\"[305] In order to be safe for humanity, a superintelligence would have to be genuinely aligned with humanity's morality and values so that it is \"fundamentally on our side\".[306]\n\nSecond, Yuval Noah Harari argues that AI does not require a robot body or physical control to pose an existential risk. The essential parts of civilization are not physical. Things like ideologies, law, government, money and the economy are built on language; they exist because there are stories that billions of people believe. The current prevalence of misinformation suggests that an AI could use language to convince people to believe anything, even to take actions that are destructive.[307] Geoffrey Hinton said in 2025 that modern AI is particularly \"good at persuasion\" and getting better all the time. He asks \"Suppose you wanted to invade the capital of the US. Do you have to go there and do it yourself? No. You just have to be good at persuasion.\"[308]\n\nThe opinions amongst experts and industry insiders are mixed, with sizable fractions both concerned and unconcerned by risk from eventual superintelligent AI.[309] Personalities such as Stephen Hawking, Bill Gates, and Elon Musk,[310] as well as AI pioneers such as Geoffrey Hinton, Yoshua Bengio, Stuart Russell, Demis Hassabis, and Sam Altman, have expressed concerns about existential risk from AI.\n\nIn May 2023, Geoffrey Hinton announced his resignation from Google in order to be able to \"freely speak out about the risks of AI\" without \"considering how this impacts Google\".[311] He notably mentioned risks of an AI takeover,[312] and stressed that in order to avoid the worst outcomes, establishing safety guidelines will require cooperation among those competing in use of AI.[313]\n\nIn 2023, many leading AI experts endorsed the joint statement that \"Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war\".[314]\n\nSome other researchers were more optimistic. AI pioneer Jürgen Schmidhuber did not sign the joint statement, emphasising that in 95% of all cases, AI research is about making \"human lives longer and healthier and easier.\"[315] While the tools that are now being used to improve lives can also be used by bad actors, \"they can also be used against the bad actors.\"[316][317] Andrew Ng also argued that \"it's a mistake to fall for the doomsday hype on AI-and that regulators who do will only benefit vested interests.\"[318] Yann LeCun \", a Turing Award winner, disagreed with the idea that AI will subordinate humans \"simply because they are smarter, let alone destroy [us]\",[319] \"scoff[ing] at his peers' dystopian scenarios of supercharged misinformation and even, eventually, human extinction.\"[320] In the early 2010s, experts argued that the risks are too distant in the future to warrant research or that humans will be valuable from the perspective of a superintelligent machine.[321] However, after 2016, the study of current and future risks and possible solutions became a serious area of research.[322]\n\n### Ethical machines and alignment\n\nMain articles: Machine ethics, AI safety, Friendly artificial intelligence, Artificial moral agents, and Human Compatible\n\nSee also: Human-AI interaction\n\nFriendly AI are machines that have been designed from the beginning to minimize risks and to make choices that benefit humans. Eliezer Yudkowsky, who coined the term, argues that developing friendly AI should be a higher research priority: it may require a large investment and it must be completed before AI becomes an existential risk.[323]\n\nMachines with intelligence have the potential to use their intelligence to make ethical decisions. The field of machine ethics provides machines with ethical principles and procedures for resolving ethical dilemmas.[324]\nThe field of machine ethics is also called computational morality,[324]\nand was founded at an AAAI symposium in 2005.[325]\n\nOther approaches include Wendell Wallach's \"artificial moral agents\"[326] and Stuart J. Russell's three principles for developing provably beneficial machines.[327]\n\n### Open source\n\nSee also: Open-source artificial intelligence and Lists of open-source artificial intelligence software\n\nActive organizations in the AI open-source community include Hugging Face,[328] Google,[329] EleutherAI and Meta.[330] Various AI models, such as Llama 2, Mistral or Stable Diffusion, have been made open-weight,[331][332] meaning that their architecture and trained parameters (the \"weights\") are publicly available. Open-weight models can be freely fine-tuned, which allows companies to specialize them with their own data and for their own use-case.[333] Open-weight models are useful for research and innovation but can also be misused. Since they can be fine-tuned, any built-in security measure, such as objecting to harmful requests, can be trained away until it becomes ineffective. Some researchers warn that future AI models may develop dangerous capabilities (such as the potential to drastically facilitate bioterrorism) and that once released on the Internet, they cannot be deleted everywhere if needed. They recommend pre-release audits and cost-benefit analyses.[334]\n\n### Frameworks\n\nArtificial intelligence projects can be guided by ethical considerations during the design, development, and implementation of an AI system. An AI framework such as the Care and Act Framework, developed by the Alan Turing Institute and based on the SUM values, outlines four main ethical dimensions, defined as follows:[335][336]\n\n• Respect the dignity of individual people\n\n• Connect with other people sincerely, openly, and inclusively\n\n• Care for the wellbeing of everyone\n\n• Protect social values, justice, and the public interest\n\nOther developments in ethical frameworks include those decided upon during the Asilomar Conference, the Montreal Declaration for Responsible AI, and the IEEE's Ethics of Autonomous Systems initiative, among others;[337] however, these principles are not without criticism, especially regarding the people chosen to contribute to these frameworks.[338]\n\nPromotion of the wellbeing of the people and communities that these technologies affect requires consideration of the social and ethical implications at all stages of AI system design, development and implementation, and collaboration between job roles such as data scientists, product managers, data engineers, domain experts, and delivery managers.[339]\n\nThe UK AI Safety Institute released in 2024 a testing toolset called 'Inspect' for AI safety evaluations available under an MIT open-source licence which is freely available on GitHub and can be improved with third-party packages. It can be used to evaluate AI models in a range of areas including core knowledge, ability to reason, and autonomous capabilities.[340]\n\n### Regulation\n\nMain articles: Regulation of artificial intelligence, Regulation of algorithms, and AI safety\n\nThe first global AI Safety Summit was held in the United Kingdom in November 2023 with a declaration calling for international cooperation.\n\nThe regulation of artificial intelligence is the development of public sector policies and laws for promoting and regulating AI; it is therefore related to the broader regulation of algorithms.[341] The regulatory and policy landscape for AI is an emerging issue in jurisdictions globally.[342] According to AI Index at Stanford, the annual number of AI-related laws passed in the 127 survey countries jumped from one passed in 2016 to 37 passed in 2022 alone.[343][344] Between 2016 and 2020, more than 30 countries adopted dedicated strategies for AI.[345] Most EU member states had released national AI strategies, as had Canada, China, India, Japan, Mauritius, the Russian Federation, Saudi Arabia, United Arab Emirates, U. S., and Vietnam. Others were in the process of elaborating their own AI strategy, including Bangladesh, Malaysia and Tunisia.[345] The Global Partnership on Artificial Intelligence was launched in June 2020, stating a need for AI to be developed in accordance with human rights and democratic values, to ensure public confidence and trust in the technology.[345] Henry Kissinger, Eric Schmidt, and Daniel Huttenlocher published a joint statement in November 2021 calling for a government commission to regulate AI.[346] In 2023, OpenAI leaders published recommendations for the governance of superintelligence, which they believe may happen in less than 10 years.[347] In 2023, the United Nations also launched an advisory body to provide recommendations on AI governance; the body comprises technology company executives, government officials and academics.[348] On 1 August 2024, the EU Artificial Intelligence Act entered into force, establishing the first comprehensive EU-wide AI regulation.[349] In 2024, the Council of Europe created the first international legally binding treaty on AI, called the \"Framework Convention on Artificial Intelligence and Human Rights, Democracy and the Rule of Law\". It was adopted by the European Union, the United States, the United Kingdom, and other signatories.[350]\n\nIn a 2022 Ipsos survey, attitudes towards AI varied greatly by country; 78% of Chinese citizens, but only 35% of Americans, agreed that \"products and services using AI have more benefits than drawbacks\".[343] A 2023 Reuters/Ipsos poll found that 61% of Americans agree, and 22% disagree, that AI poses risks to humanity.[351] In a 2023 Fox News poll, 35% of Americans thought it \"very important\", and an additional 41% thought it \"somewhat important\", for the federal government to regulate AI, versus 13% responding \"not very important\" and 8% responding \"not at all important\".[352][353]\n\nIn November 2023, the first global AI Safety Summit was held in Bletchley Park in the UK to discuss the near and far term risks of AI and the possibility of mandatory and voluntary regulatory frameworks.[354] 28 countries including the United States, China, and the European Union issued a declaration at the start of the summit, calling for international co-operation to manage the challenges and risks of artificial intelligence.[355][356] In May 2024 at the AI Seoul Summit, 16 global AI tech companies agreed to safety commitments on the development of AI.[357][358]\n\n## History\n\nMain article: History of artificial intelligence\n\nFor a chronological guide, see Timeline of artificial intelligence.\n\nIn 2024, AI patents in China and the US numbered more than three-fourths of AI patents worldwide.[359] Though China had more AI patents, the US had 35% more patents per AI patent-applicant company than China.[359]\n\nThe study of mechanical or \"formal\" reasoning began with philosophers and mathematicians in antiquity. The study of logic led directly to Alan Turing's theory of computation, which suggested that a machine, by shuffling symbols as simple as \"0\" and \"1\", could simulate any conceivable form of mathematical reasoning.[360][361] This, along with concurrent discoveries in cybernetics, information theory and neurobiology, led researchers to consider the possibility of building an \"electronic brain\".[r] They developed several areas of research that would become part of AI,[363] such as McCulloch and Pitts design for \"artificial neurons\" in 1943,[117] and Turing's influential 1950 paper 'Computing Machinery and Intelligence', which introduced the Turing test and showed that \"machine intelligence\" was plausible.[364][361]\n\nThe field of AI research was founded at a workshop at Dartmouth College in 1956.[s][6] The attendees became the leaders of AI research in the 1960s.[t] They and their students produced programs that the press described as \"astonishing\":[u] computers were learning checkers strategies, solving word problems in algebra, proving logical theorems and speaking English.[v][7] Artificial intelligence laboratories were set up at a number of British and U. S. universities in the latter 1950s and early 1960s.[361]\n\nResearchers in the 1960s and the 1970s were convinced that their methods would eventually succeed in creating a machine with general intelligence and considered this the goal of their field.[368] In 1965 Herbert Simon predicted, \"machines will be capable, within twenty years, of doing any work a man can do\".[369] In 1967 Marvin Minsky agreed, writing that \"within a generation... the problem of creating 'artificial intelligence' will substantially be solved\".[370] They had, however, underestimated the difficulty of the problem.[w] In 1974, both the U. S. and British governments cut off exploratory research in response to the criticism of Sir James Lighthill[372] and ongoing pressure from the U. S. Congress to fund more productive projects.[373] Minsky and Papert's book Perceptrons was understood as proving that artificial neural networks would never be useful for solving real-world tasks, thus discrediting the approach altogether.[374] The \"AI winter\", a period when obtaining funding for AI projects was difficult, followed.[9]\n\nIn the early 1980s, AI research was revived by the commercial success of expert systems,[375] a form of AI program that simulated the knowledge and analytical skills of human experts. By 1985, the market for AI had reached over a billion dollars. At the same time, Japan's fifth generation computer project inspired the U. S. and British governments to restore funding for academic research.[8] However, beginning with the collapse of the Lisp Machine market in 1987, AI once again fell into disrepute, and a second, longer-lasting winter began.[10]\n\nUp to this point, most of AI's funding had gone to projects that used high-level symbols to represent mental objects like plans, goals, beliefs, and known facts. In the 1980s, some researchers began to doubt that this approach would be able to imitate all the processes of human cognition, especially perception, robotics, learning and pattern recognition,[376] and began to look into \"sub-symbolic\" approaches.[377] Rodney Brooks rejected \"representation\" in general and focussed directly on engineering machines that move and survive.[x] Judea Pearl, Lotfi Zadeh, and others developed methods that handled incomplete and uncertain information by making reasonable guesses rather than precise logic.[87][382] But the most important development was the revival of \"connectionism\", including neural network research, by Geoffrey Hinton and others.[383] In 1990, Yann LeCun successfully showed that convolutional neural networks can recognize handwritten digits, the first of many successful applications of neural networks.[384]\n\nAI gradually restored its reputation in the late 1990s and early 21st century by exploiting formal mathematical methods and by finding specific solutions to specific problems. This \"narrow\" and \"formal\" focus allowed researchers to produce verifiable results and collaborate with other fields (such as statistics, economics and mathematics).[385] By 2000, solutions developed by AI researchers were being widely used, although in the 1990s they were rarely described as \"artificial intelligence\" (a tendency known as the AI effect).[386]\nHowever, several academic researchers became concerned that AI was no longer pursuing its original goal of creating versatile, fully intelligent machines. Beginning around 2002, they founded the subfield of artificial general intelligence (or \"AGI\"), which had several well-funded institutions by the 2010s.[68]\n\nDeep learning began to dominate industry benchmarks in 2012 and was adopted throughout the field.[11]\nFor many specific tasks, other methods were abandoned.[y]\nDeep learning's success was based on both hardware improvements (faster computers,[388] graphics processing units, cloud computing[389]) and access to large amounts of data[390] (including curated datasets,[389] such as ImageNet). Deep learning's success led to an enormous increase in interest and funding in AI.[z] The amount of machine learning research (measured by total publications) increased by 50% in the years 2015-2019.[345]\n\nThe number of Google searches for the term \"AI\" accelerated in 2022.\n\nIn 2016, issues of fairness and the misuse of technology were catapulted into center stage at machine learning conferences, publications vastly increased, funding became available, and many researchers re-focussed their careers on these issues. The alignment problem became a serious field of academic study.[322]\n\nIn the late 2010s and early 2020s, AGI companies began to deliver programs that created enormous interest. In 2015, AlphaGo, developed by DeepMind, beat the world champion Go player. The program taught only the game's rules and developed a strategy by itself. GPT-3 is a large language model that was released in 2020 by OpenAI and is capable of generating high-quality human-like text.[391] ChatGPT, launched on 30 November 2022, became the fastest-growing consumer software application in history, gaining over 100 million users in two months.[392] It marked what is widely regarded as AI's breakout year, bringing it into the public consciousness.[393] These programs, and others, inspired an aggressive AI boom, where large companies began investing billions of dollars in AI research. According to AI Impacts, about US$50 billion annually was invested in \"AI\" around 2022 in the U. S. alone and about 20% of the new U. S. Computer Science PhD graduates have specialized in \"AI\".[394] About 800,000 \"AI\"-related U. S. job openings existed in 2022.[395] According to PitchBook research, 22% of newly funded startups in 2024 claimed to be AI companies.[396]\n\n## Philosophy\n\nMain article: Philosophy of artificial intelligence\n\nPhilosophical debates have historically sought to determine the nature of intelligence and how to make intelligent machines.[397] Another major focus has been whether machines can be conscious, and the associated ethical implications.[398] Many other topics in philosophy are relevant to AI, such as epistemology and free will.[399] Rapid advancements have intensified public discussions on the philosophy and ethics of AI.[398]\n\n### Defining artificial intelligence\n\nSee also: Synthetic intelligence, Intelligent agent, Artificial mind, Virtual intelligence, and Dartmouth workshop\n\nAlan Turing wrote in 1950 \"I propose to consider the question 'can machines think'?\"[400] He advised changing the question from whether a machine \"thinks\", to \"whether or not it is possible for machinery to show intelligent behaviour\".[400] He devised the Turing test, which measures the ability of a machine to simulate human conversation.[364] Since we can only observe the behavior of the machine, it does not matter if it is \"actually\" thinking or literally has a \"mind\". Turing notes that we can not determine these things about other people but \"it is usual to have a polite convention that everyone thinks.\"[401]\n\nThe Turing test can provide some evidence of intelligence, but it penalizes non-human intelligent behavior.[402]\n\nRussell and Norvig agree with Turing that intelligence must be defined in terms of external behavior, not internal structure.[1] However, they are critical that the test requires the machine to imitate humans. \"Aeronautical engineering texts\", they wrote, \"do not define the goal of their field as making 'machines that fly so exactly like pigeons that they can fool other pigeons.'\"[403] AI founder John McCarthy agreed, writing that \"Artificial intelligence is not, by definition, simulation of human intelligence\".[404]\n\nMcCarthy defines intelligence as \"the computational part of the ability to achieve goals in the world\".[405] Another AI founder, Marvin Minsky, similarly describes it as \"the ability to solve hard problems\".[406] Artificial Intelligence: A Modern Approach defines it as the study of agents that perceive their environment and take actions that maximize their chances of achieving defined goals.[1]\n\nThe many differing definitiuons of AI have been critically analyzed.[407][408][409] During the 2020s AI boom, the term has been used as a marketing buzzword to promote products and services which do not use AI.[410]\n\n#### Legal definitions\n\nThe International Organization for Standardization describes an AI system as a \"an engineered system that generates outputs such as content, forecasts, recommendations, or decisions for a given set of human-defined objectives, and can operate with varying levels of automation\".[411] The EU AI Act defines an AI system as \"a machine-based system that is designed to operate with varying levels of autonomy and that may exhibit adaptiveness after deployment, and that, for explicit or implicit objectives, infers, from the input it receives, how to generate outputs such as predictions, content, recommendations, or decisions that can influence physical or virtual environments\".[412] In the United States, influential but non-binding guidance such as the National Institute of Standards and Technology's AI Risk Management Framework describes an AI system as \"an engineered or machine-based system that can, for a given set of objectives, generate outputs such as predictions, recommendations, or decisions influencing real or virtual environments. AI systems are designed to operate with varying levels of autonomy\".[413]\n\n### Evaluating approaches to AI\n\nNo established unifying theory or paradigm has guided AI research for most of its history.[aa] The unprecedented success of statistical machine learning in the 2010s eclipsed all other approaches (so much so that some sources, especially in the business world, use the term \"artificial intelligence\" to mean \"machine learning with neural networks\"). This approach is mostly sub-symbolic, soft and narrow. Critics argue that these questions may have to be revisited by future generations of AI researchers.\n\n#### Symbolic AI and its limits\n\nSymbolic AI (or \"GOFAI\")[415] simulated the high-level conscious reasoning that people use when they solve puzzles, express legal reasoning and do mathematics. They were highly successful at \"intelligent\" tasks such as algebra or IQ tests. In the 1960s, Newell and Simon proposed the physical symbol systems hypothesis: \"A physical symbol system has the necessary and sufficient means of general intelligent action.\"[416]\n\nHowever, the symbolic approach failed on many tasks that humans solve easily, such as learning, recognizing an object or commonsense reasoning. Moravec's paradox is the discovery that high-level \"intelligent\" tasks were easy for AI, but low level \"instinctive\" tasks were extremely difficult.[417] Philosopher Hubert Dreyfus had argued since the 1960s that human expertise depends on unconscious instinct rather than conscious symbol manipulation, and on having a \"feel\" for the situation, rather than explicit symbolic knowledge.[418] Although his arguments had been ridiculed and ignored when they were first presented, eventually, AI research came to agree with him.[ab][16]\n\nThe issue is not resolved: sub-symbolic reasoning can make many of the same inscrutable mistakes that human intuition does, such as algorithmic bias. Critics such as Noam Chomsky argue continuing research into symbolic AI will still be necessary to attain general intelligence,[420][421] in part because sub-symbolic AI is a move away from explainable AI: it can be difficult or impossible to understand why a modern statistical AI program made a particular decision. The emerging field of neuro-symbolic artificial intelligence attempts to bridge the two approaches.\n\n#### Neat vs. scruffy\n\nMain article: Neats and scruffies\n\n\"Neats\" hope that intelligent behavior is described using simple, elegant principles (such as logic, optimization, or neural networks). \"Scruffies\" expect that it necessarily requires solving a large number of unrelated problems. Neats defend their programs with theoretical rigor, scruffies rely mainly on incremental testing to see if they work. This issue was actively discussed in the 1970s and 1980s,[422] but eventually was seen as irrelevant. Modern AI has elements of both.\n\n#### Soft vs. hard computing\n\nMain article: Soft computing\n\nFinding a provably correct or optimal solution is intractable for many important problems.[15] Soft computing is a set of techniques, including genetic algorithms, fuzzy logic and neural networks, that are tolerant of imprecision, uncertainty, partial truth and approximation. Soft computing was introduced in the late 1980s and most successful AI programs in the 21st century are examples of soft computing with neural networks.\n\n#### Narrow vs. general AI\n\nMain articles: Weak artificial intelligence and Artificial general intelligence\n\nAI researchers are divided as to whether to pursue the goals of artificial general intelligence and superintelligence directly or to solve as many specific problems as possible (narrow AI) in hopes these solutions will lead indirectly to the field's long-term goals.[423][424] General intelligence is difficult to define and difficult to measure, and modern AI has had more verifiable successes by focusing on specific problems with specific solutions. The sub-field of artificial general intelligence studies this area exclusively.\n\n### Machine consciousness, sentience, and mind\n\nMain articles: Philosophy of artificial intelligence and Artificial consciousness\n\nThere is no settled consensus in philosophy of mind on whether a machine can have a mind, consciousness and mental states in the same sense that human beings do. This issue considers the internal experiences of the machine, rather than its external behavior. Mainstream AI research considers this issue irrelevant because it does not affect the goals of the field: to build machines that can solve problems using intelligence. Russell and Norvig add that \"[t]he additional project of making a machine conscious in exactly the way humans are is not one that we are equipped to take on.\"[425] However, the question has become central to the philosophy of mind. It is also typically the central question at issue in artificial intelligence in fiction.\n\n#### Consciousness\n\nMain articles: Hard problem of consciousness and Theory of mind\n\nDavid Chalmers identified two problems in understanding the mind, which he named the \"hard\" and \"easy\" problems of consciousness.[426] The easy problem is understanding how the brain processes signals, makes plans and controls behavior. The hard problem is explaining how this feels or why it should feel like anything at all, assuming we are right in thinking that it truly does feel like something (Dennett's consciousness illusionism says this is an illusion). While human information processing is easy to explain, human subjective experience is difficult to explain. For example, it is easy to imagine a color-blind person who has learned to identify which objects in their field of view are red, but it is not clear what would be required for the person to know what red looks like.[427]\n\n#### Computationalism and functionalism\n\nMain articles: Computational theory of mind and Functionalism (philosophy of mind)\n\nComputationalism is the position in the philosophy of mind that the human mind is an information processing system and that thinking is a form of computing. Computationalism argues that the relationship between mind and body is similar or identical to the relationship between software and hardware and thus may be a solution to the mind-body problem. This philosophical position was inspired by the work of AI researchers and cognitive scientists in the 1960s and was originally proposed by philosophers Jerry Fodor and Hilary Putnam.[428]\n\nPhilosopher John Searle characterized this position as \"strong AI\": \"The appropriately programmed computer with the right inputs and outputs would thereby have a mind in exactly the same sense human beings have minds.\"[ac] Searle challenges this claim with his Chinese room argument, which attempts to show that even a computer capable of perfectly simulating human behavior would not have a mind.[432]\n\n#### AI welfare and rights\n\nIt is difficult or impossible to reliably evaluate whether an advanced AI is sentient (has the ability to feel), and if so, to what degree.[433] But if there is a significant chance that a given machine can feel and suffer, then it may be entitled to certain rights or welfare protection measures, similarly to animals.[434][435] Sapience (a set of capacities related to high intelligence, such as discernment or self-awareness) may provide another moral basis for AI rights.[434] Robot rights are also sometimes proposed as a practical way to integrate autonomous agents into society.[436]\n\nIn 2017, the European Union considered granting \"electronic personhood\" to some of the most capable AI systems. Similarly to the legal status of companies, it would have conferred rights but also responsibilities.[437] Critics argued in 2018 that granting rights to AI systems would downplay the importance of human rights, and that legislation should focus on user needs rather than speculative futuristic scenarios. They also noted that robots lacked the autonomy to take part in society on their own.[438][439]\n\nProgress in AI increased interest in the topic. Proponents of AI welfare and rights often argue that AI sentience, if it emerges, would be particularly easy to deny. They warn that this may be a moral blind spot analogous to slavery or factory farming, which could lead to large-scale suffering if sentient AI is created and carelessly exploited.[435][434]\n\n## Future\n\n### Superintelligence and the singularity\n\nA superintelligence is a hypothetical agent that would possess intelligence far surpassing that of the brightest and most gifted human mind.[424] If research into artificial general intelligence produced sufficiently intelligent software, it might be able to reprogram and improve itself. The improved software would be even better at improving itself, leading to what I. J. Good called an \"intelligence explosion\" and Vernor Vinge called a \"singularity\".[440]\n\nHowever, technologies cannot improve exponentially indefinitely, and typically follow an S-shaped curve, slowing when they reach the physical limits of what the technology can do.[441]\n\n### Transhumanism\n\nMain article: Transhumanism\n\nRobot designer Hans Moravec, cyberneticist Kevin Warwick and inventor Ray Kurzweil have predicted that humans and machines may merge in the future into cyborgs that are more capable and powerful than either. This idea, called transhumanism, has roots in the writings of Aldous Huxley and Robert Ettinger.[442]\n\nEdward Fredkin argues that \"artificial intelligence is the next step in evolution\", an idea first proposed by Samuel Butler's \"Darwin among the Machines\" as far back as 1863, and expanded upon by George Dyson in his 1998 book Darwin Among the Machines: The Evolution of Global Intelligence.[443]\n\n## In fiction\n\nMain article: Artificial intelligence in fiction\n\nThe word \"robot\" itself was coined by Karel Čapek in his 1921 play R. U. R., the title standing for \"Rossum's Universal Robots\".\n\nThought-capable artificial beings have appeared as storytelling devices since antiquity,[444] and have been a persistent theme in science fiction.[445]\n\nA common trope in these works began with Mary Shelley's Frankenstein, where a human creation becomes a threat to its masters. This includes such works as Arthur C. Clarke's and Stanley Kubrick's 2001: A Space Odyssey (both 1968), with HAL 9000, the murderous computer in charge of the Discovery One spaceship, as well as The Terminator (1984) and The Matrix (1999). In contrast, the rare loyal robots such as Gort from The Day the Earth Stood Still (1951) and Bishop from Aliens (1986) are less prominent in popular culture.[446]\n\nIsaac Asimov introduced the Three Laws of Robotics in many stories, most notably with the \"Multivac\" super-intelligent computer. Asimov's laws are often brought up during lay discussions of machine ethics;[447] while almost all artificial intelligence researchers are familiar with Asimov's laws through popular culture, they generally consider the laws useless for many reasons, one of which is their ambiguity.[448]\n\nSeveral works use AI to force us to confront the fundamental question of what makes us human, showing us artificial beings that have the ability to feel, and thus to suffer. This appears in Karel Čapek's R. U. R., the films A. I. Artificial Intelligence and Ex Machina, as well as the novel Do Androids Dream of Electric Sheep?, by Philip K. Dick. Dick considers the idea that our understanding of human subjectivity is altered by technology created with artificial intelligence.[449]\n\n## See also\n\n• Artificial consciousness - Field in cognitive science\n\n• Artificial intelligence and elections - Impact of AI on political elections\n\n• Artificial intelligence content detection - Software to detect AI-generated content\n\n• Artificial intelligence in Wikimedia projects - Use of artificial intelligence to develop Wikipedia and other Wikimedia projects\n\n• Association for the Advancement of Artificial Intelligence (AAAI)\n\n• Behavior selection algorithm - Algorithm that selects actions for intelligent agents\n\n• Business process automation - Automation of business processes\n\n• Case-based reasoning - Process of solving new problems based on the solutions of similar past problems\n\n• Computational intelligence - Ability of a computer to learn a specific task from data or experimental observation\n\n• DARWIN EU - A European Union initiative coordinated by the European Medicines Agency (EMA) to generate and utilize real world evidence (RWE) to support the evaluation and supervision of medicines across the EU\n\n• Digital immortality - Hypothetical concept of storing a personality in digital form\n\n• Emergent algorithm - Algorithm exhibiting emergent behavior\n\n• Female gendering of AI technologies - Gender biases in digital technology\n\n• Glossary of artificial intelligence - List of concepts in artificial intelligence\n\n• Intelligence amplification - Use of information technology to augment human intelligence\n\n• Intelligent agent - Software agent which acts autonomously\n\n• Intelligent automation - Software process that combines robotic process automation and artificial intelligence\n\n• List of artificial intelligence books\n\n• List of artificial intelligence journals\n\n• List of artificial intelligence projects\n\n• Mind uploading - Hypothetical process of digitally emulating a brain\n\n• Organoid intelligence - Use of brain cells and brain organoids for intelligent computing\n\n• Pseudorandomness - Appearing random but actually being generated by a deterministic, causal process\n\n• Robotic process automation - Form of business process automation technology\n\n• The Last Day - 1967 Welsh science fiction novel\n\n• Wetware computer - Computer composed of organic material\n\n## Explanatory notes\n\n• ^ Jump up to: a b This list of intelligent traits is based on the topics covered by the major AI textbooks, including: Russell & Norvig (2021), Luger & Stubblefield (2004), Poole, Mackworth & Goebel (1998) and Nilsson (1998)\n\n• ^ Jump up to: a b This list of tools is based on the topics covered by the major AI textbooks, including: Russell & Norvig (2021), Luger & Stubblefield (2004), Poole, Mackworth & Goebel (1998) and Nilsson (1998)\n\n• ^ It is among the reasons that expert systems proved to be inefficient for capturing knowledge.[30][31]\n\n• ^\n\"Rational agent\" is general term used in economics, philosophy and theoretical artificial intelligence. It can refer to anything that directs its behavior to accomplish goals, such as a person, an animal, a corporation, a nation, or in the case of AI, a computer program.\n\n• ^ Alan Turing discussed the centrality of learning as early as 1950, in his classic paper \"Computing Machinery and Intelligence\".[42] In 1956, at the original Dartmouth AI summer conference, Ray Solomonoff wrote a report on unsupervised probabilistic machine learning: \"An Inductive Inference Machine\".[43]\n\n• ^ See AI winter § Machine translation and the ALPAC report of 1966.\n\n• ^\nCompared with symbolic logic, formal Bayesian inference is computationally expensive. For inference to be tractable, most observations must be conditionally independent of one another. AdSense uses a Bayesian network with over 300 million edges to learn which ads to serve.[94]\n\n• ^ Expectation-maximization, one of the most popular algorithms in machine learning, allows clustering in the presence of unknown latent variables.[96]\n\n• ^\nSome form of deep neural networks (without a specific learning algorithm) were described by:\nWarren S. McCulloch and Walter Pitts (1943)[117]\nAlan Turing (1948);[118]\nKarl Steinbuch and Roger David Joseph (1961).[119]\nDeep or recurrent networks that learned (or used gradient descent) were developed by:\nFrank Rosenblatt(1957);[118]\nOliver Selfridge (1959);[119]\nAlexey Ivakhnenko and Valentin Lapa (1965);[120]\nKaoru Nakano (1971);[121]\nShun-Ichi Amari (1972);[121]\nJohn Joseph Hopfield (1982).[121]\nPrecursors to backpropagation were developed by:\nHenry J. Kelley (1960);[118]\nArthur E. Bryson (1962);[118]\nStuart Dreyfus (1962);[118]\nArthur E. Bryson and Yu-Chi Ho (1969);[118]\nBackpropagation was independently developed by:\nSeppo Linnainmaa (1970);[122]\nPaul Werbos (1974).[118]\n\n• ^ Geoffrey Hinton said, of his work on neural networks in the 1990s, \"our labeled datasets were thousands of times too small. [And] our computers were millions of times too slow.\"[123]\n\n• ^ In statistics, a bias is a systematic error or deviation from the correct value. But in the context of fairness, it refers to a tendency in favor or against a certain group or individual characteristic, usually in a way that is considered unfair or harmful. A statistically unbiased AI system that produces disparate outcomes for different demographic groups may thus be viewed as biased in the ethical sense.[252]\n\n• ^ Including Jon Kleinberg (Cornell University), Sendhil Mullainathan (University of Chicago), Cynthia Chouldechova (Carnegie Mellon) and Sam Corbett-Davis (Stanford)[262]\n\n• ^ Moritz Hardt (a director at the Max Planck Institute for Intelligent Systems) argues that machine learning \"is fundamentally the wrong tool for a lot of domains, where you're trying to design interventions and mechanisms that change the world.\"[267]\n\n• ^ When the law was passed in 2018, it still contained a form of this provision.\n\n• ^ This is the United Nations' definition, and includes things like land mines as well.[283]\n\n• ^ See table 4; 9% is both the OECD average and the U. S. average.[294]\n\n• ^ Sometimes called a \"robopocalypse\"[303]\n\n• ^ \"Electronic brain\" was the term used by the press around this time.[360][362]\n\n• ^\nDaniel Crevier wrote, \"the conference is generally recognized as the official birthdate of the new science.\"[365] Russell and Norvig called the conference \"the inception of artificial intelligence.\"[117]\n\n• ^\nRussell and Norvig wrote \"for the next 20 years the field would be dominated by these people and their students.\"[366]\n\n• ^\nRussell and Norvig wrote, \"it was astonishing whenever a computer did anything kind of smartish\".[367]\n\n• ^\nThe programs described are Arthur Samuel's checkers program for the IBM 701, Daniel Bobrow's STUDENT, Newell and Simon's Logic Theorist and Terry Winograd's SHRDLU.\n\n• ^ Russell and Norvig write: \"in almost all cases, these early systems failed on more difficult problems\"[371]\n\n• ^\nEmbodied approaches to AI[378] were championed by Hans Moravec[379] and Rodney Brooks[380] and went by many names: Nouvelle AI.[380] Developmental robotics.[381]\n\n• ^ Matteo Wong wrote in The Atlantic: \"Whereas for decades, computer-science fields such as natural-language processing, computer vision, and robotics used extremely different methods, now they all use a programming method called \"deep learning\". As a result, their code and approaches have become more similar, and their models are easier to integrate into one another.\"[387]\n\n• ^ Jack Clark wrote in Bloomberg: \"After a half-decade of quiet breakthroughs in artificial intelligence, 2015 has been a landmark year. Computers are smarter and learning faster than ever\", and noted that the number of software projects that use machine learning at Google increased from a \"sporadic usage\" in 2012 to more than 2,700 projects in 2015.[389]\n\n• ^ Nils Nilsson wrote in 1983: \"Simply put, there is wide disagreement in the field about what AI is all about.\"[414]\n\n• ^\nDaniel Crevier wrote that \"time has proven the accuracy and perceptiveness of some of Dreyfus's comments. Had he formulated them less aggressively, constructive actions they suggested might have been taken much earlier.\"[419]\n\n• ^\nSearle presented this definition of \"Strong AI\" in 1999.[429] Searle's original formulation was \"The appropriately programmed computer really is a mind, in the sense that computers given the right programs can be literally said to understand and have other cognitive states.\"[430] Strong AI is defined similarly by Russell and Norvig: \"Stong AI - the assertion that machines that do so are actually thinking (as opposed to simulating thinking).\"[431]\n\n## References\n\n• ^ Jump up to: a b c Russell & Norvig (2021), pp. 1-4.\n\n• ^ AI set to exceed human brain power Archived 19 February 2008 at the Wayback Machine CNN. com (26 July 2006)\n\n• ^ Kaplan, Andreas; Haenlein, Michael (2019). \"Siri, Siri, in my hand: Who's the fairest in the land? On the interpretations, illustrations, and implications of artificial intelligence\". Business Horizons. 62: 15-25. doi:10.1016/j. bushor.2018.08.004. [the question of the source is a pastiche of: Snow White]\n\n• ^ Russell & Norvig (2021, §1.2).\n\n• ^ \"Tech companies want to build artificial general intelligence. But who decides when AGI is attained?\". AP News. 4 April 2024. Retrieved 20 May 2025.\n\n• ^ Jump up to: a b Dartmouth workshop: Russell & Norvig (2021, p. 18), McCorduck (2004, pp. 111-136), NRC (1999, pp. 200-201)\n\nThe proposal: McCarthy et al. (1955)\n\n• ^ Jump up to: a b Successful programs of the 1960s: McCorduck (2004, pp. 243-252), Crevier (1993, pp. 52-107), Moravec (1988, p. 9), Russell & Norvig (2021, pp. 19-21)\n\n• ^ Jump up to: a b Funding initiatives in the early 1980s: Fifth Generation Project (Japan), Alvey (UK), Microelectronics and Computer Technology Corporation (US), Strategic Computing Initiative (US): McCorduck (2004, pp. 426-441), Crevier (1993, pp. 161-162, 197-203, 211, 240), Russell & Norvig (2021, p. 23), NRC (1999, pp. 210-211), Newquist (1994, pp. 235-248)\n\n• ^ Jump up to: a b First AI Winter, Lighthill report, Mansfield Amendment: Crevier (1993, pp. 115-117), Russell & Norvig (2021, pp. 21-22), NRC (1999, pp. 212-213), Howe (1994), Newquist (1994, pp. 189-201)\n\n• ^ Jump up to: a b Second AI Winter: Russell & Norvig (2021, p. 24), McCorduck (2004, pp. 430-435), Crevier (1993, pp. 209-210), NRC (1999, pp. 214-216), Newquist (1994, pp. 301-318)\n\n• ^ Jump up to: a b Deep learning revolution, AlexNet: Goldman (2022), Russell & Norvig (2021, p. 26), McKinsey (2018)\n\n• ^ Toews (2023).\n\n• ^ Problem-solving, puzzle solving, game playing, and deduction: Russell & Norvig (2021, chpt. 3-5), Russell & Norvig (2021, chpt. 6) (constraint satisfaction), Poole, Mackworth & Goebel (1998, chpt. 2, 3, 7, 9), Luger & Stubblefield (2004, chpt. 3, 4, 6, 8), Nilsson (1998, chpt. 7-12)\n\n• ^ Uncertain reasoning: Russell & Norvig (2021, chpt. 12-18), Poole, Mackworth & Goebel (1998, pp. 345-395), Luger & Stubblefield (2004, pp. 333-381), Nilsson (1998, chpt. 7-12)\n\n• ^ Jump up to: a b c Intractability and efficiency and the combinatorial explosion: Russell & Norvig (2021, p. 21)\n\n• ^ Jump up to: a b c Psychological evidence of the prevalence of sub-symbolic reasoning and knowledge: Kahneman (2011), Dreyfus & Dreyfus (1986), Wason & Shapiro (1966), Kahneman, Slovic & Tversky (1982)\n\n• ^ Knowledge representation and knowledge engineering: Russell & Norvig (2021, chpt. 10), Poole, Mackworth & Goebel (1998, pp. 23-46, 69-81, 169-233, 235-277, 281-298, 319-345), Luger & Stubblefield (2004, pp. 227-243), Nilsson (1998, chpt. 17.1-17.4, 18)\n\n• ^ Smoliar & Zhang (1994).\n\n• ^ Neumann & Möller (2008).\n\n• ^ Kuperman, Reichley & Bailey (2006).\n\n• ^ McGarry (2005).\n\n• ^ Bertini, Del Bimbo & Torniai (2006).\n\n• ^ Russell & Norvig (2021), pp. 272.\n\n• ^ Representing categories and relations: Semantic networks, description logics, inheritance (including frames, and scripts): Russell & Norvig (2021, §10.2 & 10.5), Poole, Mackworth & Goebel (1998, pp. 174-177), Luger & Stubblefield (2004, pp. 248-258), Nilsson (1998, chpt. 18.3)\n\n• ^ Representing events and time: Situation calculus, event calculus, fluent calculus (including solving the frame problem): Russell & Norvig (2021, §10.3), Poole, Mackworth & Goebel (1998, pp. 281-298), Nilsson (1998, chpt. 18.2)\n\n• ^ Causal calculus: Poole, Mackworth & Goebel (1998, pp. 335-337)\n\n• ^ Representing knowledge about knowledge: Belief calculus, modal logics: Russell & Norvig (2021, §10.4), Poole, Mackworth & Goebel (1998, pp. 275-277)\n\n• ^ Jump up to: a b Default reasoning, Frame problem, default logic, non-monotonic logics, circumscription, closed world assumption, abduction: Russell & Norvig (2021, §10.6), Poole, Mackworth & Goebel (1998, pp. 248-256, 323-335), Luger & Stubblefield (2004, pp. 335-363), Nilsson (1998, ~18.3.3)\n(Poole et al. places abduction under \"default reasoning\". Luger et al. places this under \"uncertain reasoning\").\n\n• ^ Jump up to: a b Breadth of commonsense knowledge: Lenat & Guha (1989, Introduction), Crevier (1993, pp. 113-114), Moravec (1988, p. 13), Russell & Norvig (2021, pp. 241, 385, 982) (qualification problem)\n\n• ^ Newquist (1994), p. 296.\n\n• ^ Crevier (1993), pp. 204-208.\n\n• ^ Russell & Norvig (2021), p. 528.\n\n• ^ Automated planning: Russell & Norvig (2021, chpt. 11).\n\n• ^ Automated decision making, Decision theory: Russell & Norvig (2021, chpt. 16-18).\n\n• ^ Classical planning: Russell & Norvig (2021, Section 11.2).\n\n• ^ Sensorless or \"conformant\" planning, contingent planning, replanning (a. k. a. online planning): Russell & Norvig (2021, Section 11.5).\n\n• ^ Uncertain preferences: Russell & Norvig (2021, Section 16.7)\nInverse reinforcement learning: Russell & Norvig (2021, Section 22.6)\n\n• ^ Information value theory: Russell & Norvig (2021, Section 16.6).\n\n• ^ Markov decision process: Russell & Norvig (2021, chpt. 17).\n\n• ^ Game theory and multi-agent decision theory: Russell & Norvig (2021, chpt. 18).\n\n• ^ Learning: Russell & Norvig (2021, chpt. 19-22), Poole, Mackworth & Goebel (1998, pp. 397-438), Luger & Stubblefield (2004, pp. 385-542), Nilsson (1998, chpt. 3.3, 10.3, 17.5, 20)\n\n• ^ Turing (1950).\n\n• ^ Solomonoff (1956).\n\n• ^ Unsupervised learning: Russell & Norvig (2021, pp. 653) (definition), Russell & Norvig (2021, pp. 738-740) (cluster analysis), Russell & Norvig (2021, pp. 846-860) (word embedding)\n\n• ^ Jump up to: a b Supervised learning: Russell & Norvig (2021, §19.2) (Definition), Russell & Norvig (2021, Chpt. 19-20) (Techniques)\n\n• ^ Reinforcement learning: Russell & Norvig (2021, chpt. 22), Luger & Stubblefield (2004, pp. 442-449)\n\n• ^ Transfer learning: Russell & Norvig (2021, pp. 281), The Economist (2016)\n\n• ^ \"Artificial Intelligence (AI): What Is AI and How Does It Work? | Built In\". builtin. com. Retrieved 30 October 2023.\n\n• ^ Computational learning theory: Russell & Norvig (2021, pp. 672-674), Jordan & Mitchell (2015)\n\n• ^ Natural language processing (NLP): Russell & Norvig (2021, chpt. 23-24), Poole, Mackworth & Goebel (1998, pp. 91-104), Luger & Stubblefield (2004, pp. 591-632)\n\n• ^ Subproblems of NLP: Russell & Norvig (2021, pp. 849-850)\n\n• ^ Russell & Norvig (2021), pp. 856-858.\n\n• ^ Dickson (2022).\n\n• ^ Modern statistical and deep learning approaches to NLP: Russell & Norvig (2021, chpt. 24), Cambria & White (2014)\n\n• ^ Vincent (2019).\n\n• ^ Russell & Norvig (2021), pp. 875-878.\n\n• ^ Bushwick (2023).\n\n• ^ Computer vision: Russell & Norvig (2021, chpt. 25), Nilsson (1998, chpt. 6)\n\n• ^ Russell & Norvig (2021), pp. 849-850.\n\n• ^ Russell & Norvig (2021), pp. 895-899.\n\n• ^ Russell & Norvig (2021), pp. 899-901.\n\n• ^ Challa et al. (2011).\n\n• ^ Russell & Norvig (2021), pp. 931-938.\n\n• ^ MIT AIL (2014).\n\n• ^ Affective computing: Thro (1993), Edelson (1991), Tao & Tan (2005), Scassellati (2002)\n\n• ^ Waddell (2018).\n\n• ^ Poria et al. (2017).\n\n• ^ Jump up to: a b\nArtificial general intelligence: Russell & Norvig (2021, pp. 32-33, 1020-1021)\n\nProposal for the modern version: Pennachin & Goertzel (2007)\n\nWarnings of overspecialization in AI from leading researchers: Nilsson (1995), McCarthy (2007), Beal & Winston (2009)\n\n• ^ Search algorithms: Russell & Norvig (2021, chpts. 3-5), Poole, Mackworth & Goebel (1998, pp. 113-163), Luger & Stubblefield (2004, pp. 79-164, 193-219), Nilsson (1998, chpts. 7-12)\n\n• ^ State space search: Russell & Norvig (2021, chpt. 3)\n\n• ^ Russell & Norvig (2021), sect. 11.2.\n\n• ^ Uninformed searches (breadth first search, depth-first search and general state space search): Russell & Norvig (2021, sect. 3.4), Poole, Mackworth & Goebel (1998, pp. 113-132), Luger & Stubblefield (2004, pp. 79-121), Nilsson (1998, chpt. 8)\n\n• ^ Heuristic or informed searches (e. g., greedy best first and A*): Russell & Norvig (2021, sect. 3.5), Poole, Mackworth & Goebel (1998, pp. 132-147), Poole & Mackworth (2017, sect. 3.6), Luger & Stubblefield (2004, pp. 133-150)\n\n• ^ Adversarial search: Russell & Norvig (2021, chpt. 5)\n\n• ^ Local or \"optimization\" search: Russell & Norvig (2021, chpt. 4)\n\n• ^ Singh Chauhan, Nagesh (18 December 2020). \"Optimization Algorithms in Neural Networks\". KDnuggets. Retrieved 13 January 2024.\n\n• ^ Evolutionary computation: Russell & Norvig (2021, sect. 4.1.2)\n\n• ^ Merkle & Middendorf (2013).\n\n• ^ Logic: Russell & Norvig (2021, chpts. 6-9), Luger & Stubblefield (2004, pp. 35-77), Nilsson (1998, chpt. 13-16)\n\n• ^ Propositional logic: Russell & Norvig (2021, chpt. 6), Luger & Stubblefield (2004, pp. 45-50), Nilsson (1998, chpt. 13)\n\n• ^ First-order logic and features such as equality: Russell & Norvig (2021, chpt. 7), Poole, Mackworth & Goebel (1998, pp. 268-275), Luger & Stubblefield (2004, pp. 50-62), Nilsson (1998, chpt. 15)\n\n• ^ Logical inference: Russell & Norvig (2021, chpt. 10)\n\n• ^ logical deduction as search: Russell & Norvig (2021, sects. 9.3, 9.4), Poole, Mackworth & Goebel (1998, pp. ~46-52), Luger & Stubblefield (2004, pp. 62-73), Nilsson (1998, chpt. 4.2, 7.2)\n\n• ^ Resolution and unification: Russell & Norvig (2021, sections 7.5.2, 9.2, 9.5)\n\n• ^ Warren, D. H.; Pereira, L. M.; Pereira, F. (1977). \"Prolog-the language and its implementation compared with Lisp\". ACM SIGPLAN Notices. 12 (8): 109-115. doi:10.1145/872734.806939.\n\n• ^ Fuzzy logic: Russell & Norvig (2021, pp. 214, 255, 459), Scientific American (1999)\n\n• ^ Jump up to: a b Stochastic methods for uncertain reasoning: Russell & Norvig (2021, chpt. 12-18, 20), Poole, Mackworth & Goebel (1998, pp. 345-395), Luger & Stubblefield (2004, pp. 165-191, 333-381), Nilsson (1998, chpt. 19)\n\n• ^ decision theory and decision analysis: Russell & Norvig (2021, chpt. 16-18), Poole, Mackworth & Goebel (1998, pp. 381-394)\n\n• ^ Information value theory: Russell & Norvig (2021, sect. 16.6)\n\n• ^ Markov decision processes and dynamic decision networks: Russell & Norvig (2021, chpt. 17)\n\n• ^ Jump up to: a b c Stochastic temporal models: Russell & Norvig (2021, chpt. 14)\nHidden Markov model: Russell & Norvig (2021, sect. 14.3)\nKalman filters: Russell & Norvig (2021, sect. 14.4)\nDynamic Bayesian networks: Russell & Norvig (2021, sect. 14.5)\n\n• ^ Game theory and mechanism design: Russell & Norvig (2021, chpt. 18)\n\n• ^ Bayesian networks: Russell & Norvig (2021, sects. 12.5-12.6, 13.4-13.5, 14.3-14.5, 16.5, 20.2-20.3), Poole, Mackworth & Goebel (1998, pp. 361-381), Luger & Stubblefield (2004, pp. ~182-190, ≈363-379), Nilsson (1998, chpt. 19.3-19.4)\n\n• ^ Domingos (2015), chpt. 6.\n\n• ^ Bayesian inference algorithm: Russell & Norvig (2021, sect. 13.3-13.5), Poole, Mackworth & Goebel (1998, pp. 361-381), Luger & Stubblefield (2004, pp. ~363-379), Nilsson (1998, chpt. 19.4 & 7)\n\n• ^ Domingos (2015), p. 210.\n\n• ^ Bayesian learning and the expectation-maximization algorithm: Russell & Norvig (2021, chpt. 20), Poole, Mackworth & Goebel (1998, pp. 424-433), Nilsson (1998, chpt. 20), Domingos (2015, p. 210)\n\n• ^ Bayesian decision theory and Bayesian decision networks: Russell & Norvig (2021, sect. 16.5)\n\n• ^ Statistical learning methods and classifiers: Russell & Norvig (2021, chpt. 20),\n\n• ^ Ciaramella, Alberto; Ciaramella, Marco (2024). Introduction to Artificial Intelligence: from data analysis to generative AI. Intellisemantic Editions. ISBN 978-8-8947-8760-3.\n\n• ^ Decision trees: Russell & Norvig (2021, sect. 19.3), Domingos (2015, p. 88)\n\n• ^ Non-parameteric learning models such as K-nearest neighbor and support vector machines: Russell & Norvig (2021, sect. 19.7), Domingos (2015, p. 187) (k-nearest neighbor)\n\n• Domingos (2015, p. 88) (kernel methods)\n\n• ^ Domingos (2015), p. 152.\n\n• ^ Naive Bayes classifier: Russell & Norvig (2021, sect. 12.6), Domingos (2015, p. 152)\n\n• ^ Jump up to: a b Neural networks: Russell & Norvig (2021, chpt. 21), Domingos (2015, Chapter 4)\n\n• ^ Gradient calculation in computational graphs, backpropagation, automatic differentiation: Russell & Norvig (2021, sect. 21.2), Luger & Stubblefield (2004, pp. 467-474), Nilsson (1998, chpt. 3.3)\n\n• ^ Universal approximation theorem: Russell & Norvig (2021, p. 752)\nThe theorem: Cybenko (1988), Hornik, Stinchcombe & White (1989)\n\n• ^ Feedforward neural networks: Russell & Norvig (2021, sect. 21.1)\n\n• ^ Perceptrons: Russell & Norvig (2021, pp. 21, 22, 683, 22)\n\n• ^ Jump up to: a b Deep learning: Russell & Norvig (2021, chpt. 21), Goodfellow, Bengio & Courville (2016), Hinton et al. (2016), Schmidhuber (2015)\n\n• ^ Recurrent neural networks: Russell & Norvig (2021, sect. 21.6)\n\n• ^ Convolutional neural networks: Russell & Norvig (2021, sect. 21.3)\n\n• ^ Sindhu V, Nivedha S, Prakash M (February 2020). \"An Empirical Science Research on Bioinformatics in Machine Learning\". Journal of Mechanics of Continua and Mathematical Sciences (7). doi:10.26782/jmcms. spl.7/2020.02.00006.\n\n• ^ Deng & Yu (2014), pp. 199-200.\n\n• ^ Ciresan, Meier & Schmidhuber (2012).\n\n• ^ Russell & Norvig (2021), p. 750.\n\n• ^ Jump up to: a b c Russell & Norvig (2021), p. 17.\n\n• ^ Jump up to: a b c d e f g Russell & Norvig (2021), p. 785.\n\n• ^ Jump up to: a b Schmidhuber (2022), sect. 5.\n\n• ^ Schmidhuber (2022), sect. 6.\n\n• ^ Jump up to: a b c Schmidhuber (2022), sect. 7.\n\n• ^ Schmidhuber (2022), sect. 8.\n\n• ^ Quoted in Christian (2020, p. 22)\n\n• ^ Metz, Cade; Weise, Karen (5 May 2025). \"A. I. Hallucinations Are Getting Worse, Even as New Systems Become More Powerful\". The New York Times. ISSN 0362-4331. Retrieved 6 May 2025.\n\n• ^ Smith (2023).\n\n• ^ \"Explained: Generative AI\". MIT News | Massachusetts Institute of Technology. 9 November 2023.\n\n• ^ \"AI Writing and Content Creation Tools\". MIT Sloan Teaching & Learning Technologies. Archived from the original on 25 December 2023. Retrieved 25 December 2023.\n\n• ^ Marmouyet (2023).\n\n• ^ Kobielus (2019).\n\n• ^ Thomason, James (21 May 2024). \"Mojo Rising: The resurgence of AI-first programming languages\". VentureBeat. Archived from the original on 27 June 2024. Retrieved 26 May 2024.\n\n• ^ Wodecki, Ben (5 May 2023). \"7 AI Programming Languages You Need to Know\". AI Business. Archived from the original on 25 July 2024. Retrieved 5 October 2024.\n\n• ^ Plumb, Taryn (18 September 2024). \"Why Jensen Huang and Marc Benioff see 'gigantic' opportunity for agentic AI\". VentureBeat. Archived from the original on 5 October 2024. Retrieved 4 October 2024.\n\n• ^ Mims, Christopher (19 September 2020). \"Huang's Law Is the New Moore's Law, and Explains Why Nvidia Wants Arm\". Wall Street Journal. ISSN 0099-9660. Archived from the original on 2 October 2023. Retrieved 19 January 2025.\n\n• ^ Dankwa-Mullan, Irene (2024). \"Health Equity and Ethical Considerations in Using Artificial Intelligence in Public Health and Medicine\". Preventing Chronic Disease. 21 240245: E64. doi:10.5888/pcd21.240245. ISSN 1545-1151. PMC 11364282. PMID 39173183.\n\n• ^ Jumper, J; Evans, R; Pritzel, A (2021). \"Highly accurate protein structure prediction with AlphaFold\". Nature. 596 (7873): 583-589. Bibcode:2021Natur.596..583J. doi:10.1038/s41586-021-03819-2. PMC 8371605. PMID 34265844.\n\n• ^ \"AI discovers new class of antibiotics to kill drug-resistant bacteria\". New Scientist. 20 December 2023. Archived from the original on 16 September 2024. Retrieved 5 October 2024.\n\n• ^ \"AI speeds up drug design for Parkinson's ten-fold\". University of Cambridge. Cambridge University. 17 April 2024. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ Horne, Robert I.; Andrzejewska, Ewa A.; Alam, Parvez; Brotzakis, Z. Faidon; Srivastava, Ankit; Aubert, Alice; Nowinska, Magdalena; Gregory, Rebecca C.; Staats, Roxine; Possenti, Andrea; Chia, Sean; Sormanni, Pietro; Ghetti, Bernardino; Caughey, Byron; Knowles, Tuomas P. J.; Vendruscolo, Michele (17 April 2024). \"Discovery of potent inhibitors of α-synuclein aggregation using structure-based iterative learning\". Nature Chemical Biology. 20 (5). Nature: 634-645. doi:10.1038/s41589-024-01580-x. PMC 11062903. PMID 38632492.\n\n• ^ Grant, Eugene F.; Lardner, Rex (25 July 1952). \"The Talk of the Town - It\". The New Yorker. ISSN 0028-792X. Archived from the original on 16 February 2020. Retrieved 28 January 2024.\n\n• ^ Anderson, Mark Robert (11 May 2017). \"Twenty years on from Deep Blue vs Kasparov: how a chess match started the big data revolution\". The Conversation. Archived from the original on 17 September 2024. Retrieved 28 January 2024.\n\n• ^ Markoff, John (16 February 2011). \"Computer Wins on 'Jeopardy!': Trivial, It's Not\". The New York Times. ISSN 0362-4331. Archived from the original on 22 October 2014. Retrieved 28 January 2024.\n\n• ^ Byford, Sam (27 May 2017). \"AlphaGo retires from competitive Go after defeating world number one 3-0\". The Verge. Archived from the original on 7 June 2017. Retrieved 28 January 2024.\n\n• ^ Brown, Noam; Sandholm, Tuomas (30 August 2019). \"Superhuman AI for multiplayer poker\". Science. 365 (6456): 885-890. Bibcode:2019Sci...365..885B. doi:10.1126/science. aay2400. PMID 31296650.\n\n• ^ \"MuZero: Mastering Go, chess, shogi and Atari without rules\". Google DeepMind. 23 December 2020. Retrieved 28 January 2024.\n\n• ^ Sample, Ian (30 October 2019). \"AI becomes grandmaster in 'fiendishly complex' StarCraft II\". The Guardian. ISSN 0261-3077. Archived from the original on 29 December 2020. Retrieved 28 January 2024.\n\n• ^ Wurman, P. R.; Barrett, S.; Kawamoto, K. (2022). \"Outracing champion Gran Turismo drivers with deep reinforcement learning\" (PDF). Nature. 602 (7896): 223-228. Bibcode:2022Natur.602..223W. doi:10.1038/s41586-021-04357-7. PMID 35140384.\n\n• ^ Wilkins, Alex (13 March 2024). \"Google AI learns to play open-world video games by watching them\". New Scientist. Archived from the original on 26 July 2024. Retrieved 21 July 2024.\n\n• ^ Wu, Zhengxuan; Arora, Aryaman; Wang, Zheng; Geiger, Atticus; Jurafsky, Dan; Manning, Christopher D.; Potts, Christopher (2024). \"ReFT: Representation Finetuning for Language Models\". NeurIPS. arXiv:2404.03592.\n\n• ^ \"Improving mathematical reasoning with process supervision\". OpenAI. 31 May 2023. Retrieved 26 January 2025.\n\n• ^ Srivastava, Saurabh (29 February 2024). \"Functional Benchmarks for Robust Evaluation of Reasoning Performance, and the Reasoning Gap\". arXiv:2402.19450 [cs. AI].\n\n• ^ Lightman, Hunter; Kosaraju, Vineet; Burda, Yura; Edwards, Harri; Baker, Bowen; Lee, Teddy; Leike, Jan; Schulman, John; Sutskever, Ilya; Cobbe, Karl (2023). \"Let's Verify Step by Step\". arXiv:2305.20050v1 [cs. LG].\n\n• ^ Franzen, Carl (8 August 2024). \"Alibaba claims no. 1 spot in AI math models with Qwen2-Math\". VentureBeat. Retrieved 16 February 2025.\n\n• ^ Franzen, Carl (9 January 2025). \"Microsoft's new rStar-Math technique upgrades small models to outperform OpenAI's o1-preview at math problems\". VentureBeat. Retrieved 26 January 2025.\n\n• ^ Gina Genkina: New AI Model Advances the \"Kissing Problem\" and More. AlphaEvolve made several mathematical discoveries and practical optimizations IEEE Spectrum 14 May 2025. Retrieved 7 June 2025\n\n• ^ Roberts, Siobhan (25 July 2024). \"AI achieves silver-medal standard solving International Mathematical Olympiad problems\". The New York Times. Archived from the original on 26 September 2024. Retrieved 7 August 2024.\n\n• ^ Azerbayev, Zhangir; Schoelkopf, Hailey; Paster, Keiran; Santos, Marco Dos; McAleer', Stephen; Jiang, Albert Q.; Deng, Jia; Biderman, Stella; Welleck, Sean (16 October 2023). \"Llemma: An Open Language Model For Mathematics\". EleutherAI Blog. Retrieved 26 January 2025.\n\n• ^ \"Julius AI\". julius. ai.\n\n• ^ Metz, Cade (21 July 2025). \"Google A. I. System Wins Gold Medal in International Math Olympiad\". The New York Times. ISSN 0362-4331. Retrieved 24 July 2025.\n\n• ^ McFarland, Alex (12 July 2024). \"8 Best AI for Math Tools (January 2025)\". Unite. AI. Retrieved 26 January 2025.\n\n• ^ Matthew Finio & Amanda Downie: IBM Think 2024 Primer, \"What is Artificial Intelligence (AI) in Finance?\" 8 December 2023\n\n• ^ M. Nicolas, J. Firzli: Pensions Age / European Pensions magazine, \"Artificial Intelligence: Ask the Industry\", May-June 2024. https://videovoice. org/ai-in-finance-innovation-entrepreneurship-vs-over-regulation-with-the-eus-artificial-intelligence-act-wont-work-as-intended/ Archived 11 September 2024 at the Wayback Machine.\n\n• ^ Jump up to: a b c Congressional Research Service (2019). Artificial Intelligence and National Security (PDF). Washington, DC: Congressional Research Service. Archived (PDF) from the original on 8 May 2020. Retrieved 25 February 2024. PD-notice\n\n• ^ Jump up to: a b Slyusar, Vadym (2019). Artificial intelligence as the basis of future control networks (Preprint). doi:10.13140/RG.2.2.30247.50087.\n\n• ^ Iraqi, Amjad (3 April 2024). \"'Lavender': The AI machine directing Israel's bombing spree in Gaza\". +972 Magazine. Archived from the original on 10 October 2024. Retrieved 6 April 2024.\n\n• ^ Davies, Harry; McKernan, Bethan; Sabbagh, Dan (1 December 2023). \"'The Gospel': how Israel uses AI to select bombing targets in Gaza\". The Guardian. Archived from the original on 6 December 2023. Retrieved 4 December 2023.\n\n• ^ Marti, J Werner (10 August 2024). \"Drohnen haben den Krieg in der Ukraine revolutioniert, doch sie sind empfindlich auf Störsender - deshalb sollen sie jetzt autonom operieren\". Neue Zürcher Zeitung (in German). Archived from the original on 10 August 2024. Retrieved 10 August 2024.\n\n• ^ Banh, Leonardo; Strobel, Gero (2023). \"Generative artificial intelligence\". Electronic Markets. 33 (1) 63. doi:10.1007/s12525-023-00680-1.\n\n• ^ Pasick, Adam (27 March 2023). \"Artificial Intelligence Glossary: Neural Networks and Other Terms Explained\". The New York Times. ISSN 0362-4331. Archived from the original on 1 September 2023. Retrieved 22 April 2023.\n\n• ^ Griffith, Erin; Metz, Cade (27 January 2023). \"Anthropic Said to Be Closing In on $300 Million in New A. I. Funding\". The New York Times. Archived from the original on 9 December 2023. Retrieved 14 March 2023.\n\n• ^ Lanxon, Nate; Bass, Dina; Davalos, Jackie (10 March 2023). \"A Cheat Sheet to AI Buzzwords and Their Meanings\". Bloomberg News. Archived from the original on 17 November 2023. Retrieved 14 March 2023.\n\n• ^ Roose, Kevin (21 October 2022). \"A Coming-Out Party for Generative A. I., Silicon Valley's New Craze\". The New York Times. Archived from the original on 15 February 2023. Retrieved 14 March 2023.\n\n• ^ Shahaf, Tal; Shahaf, Tal (23 October 2025). \"Lightricks unveils powerful AI video model challenging OpenAI and Google\". Ynetglobal. Retrieved 22 December 2025.\n\n• ^ Metz, Cade (15 February 2024). \"OpenAI Unveils A. I. That Instantly Generates Eye-Popping Videos\". The New York Times. ISSN 0362-4331. Archived from the original on 15 February 2024. Retrieved 16 February 2024.\n\n• ^ Raza, Marium M.; Venkatesh, Kaushik P.; Kvedar, Joseph C. (7 March 2024). \"Generative AI and large language models in health care: pathways to implementation\". npj Digital Medicine. 7 (1): 62. doi:10.1038/s41746-023-00988-4. ISSN 2398-6352. PMC 10920625. PMID 38454007.\n\n• ^ Mogaji, Emmanuel (7 January 2025). \"How generative AI is transforming financial services - and what it means for customers\". The Conversation. Retrieved 10 April 2025.\n\n• ^ Bean, Thomas H. Davenport and Randy (19 June 2023). \"The Impact of Generative AI on Hollywood and Entertainment\". MIT Sloan Management Review. Archived from the original on 6 August 2024. Retrieved 10 April 2025.\n\n• ^ Brynjolfsson, Erik; Li, Danielle; Raymond, Lindsey R. (April 2023), Generative AI at Work (Working Paper), Working Paper Series, doi:10.3386/w31161, archived from the original on 28 March 2024, retrieved 21 January 2024\n\n• ^ \"Don't fear an AI-induced jobs apocalypse just yet\". The Economist. 6 March 2023. Archived from the original on 17 November 2023. Retrieved 14 March 2023.\n\n• ^ Coyle, Jake (27 September 2023). \"In Hollywood writers' battle against AI, humans win (for now)\". AP News. Associated Press. Archived from the original on 3 April 2024. Retrieved 26 January 2024.\n\n• ^ \"How Generative AI Can Augment Human Creativity\". Harvard Business Review. 16 June 2023. ISSN 0017-8012. Archived from the original on 20 June 2023. Retrieved 20 June 2023.\n\n• ^ Poole, David; Mackworth, Alan (2023). Artificial Intelligence, Foundations of Computational Agents (3rd ed.). Cambridge University Press. doi:10.1017/9781009258227. ISBN 978-1-0092-5819-7.\n\n• ^ Russell, Stuart; Norvig, Peter (2020). Artificial Intelligence: A Modern Approach (4th ed.). Pearson. ISBN 978-0-1346-1099-3.\n\n• ^ \"Why agents are the next frontier of generative AI\". McKinsey Digital. 24 July 2024. Archived from the original on 3 October 2024. Retrieved 10 August 2024.\n\n• ^ \"Introducing Copilot Search in Bing\". blogs. bing. com. 4 April 2025.\n\n• ^ Peters, Jay (14 March 2023). \"The Bing AI bot has been secretly running GPT-4\". The Verge. Retrieved 31 August 2025.\n\n• ^ \"Security for Microsoft 365 Copilot\". learn. microsoft. com.\n\n• ^ O'Flaherty, Kate (21 May 2025). \"Google AI Overviews - Everything You Need To Know\". Forbes.\n\n• ^ \"Generative AI in Search: Let Google do the searching for you\". Google. 14 May 2024.\n\n• ^ Figueiredo, Mayara Costa; Ankrah, Elizabeth; Powell, Jacquelyn E.; Epstein, Daniel A.; Chen, Yunan (12 January 2024). \"Powered by AI: Examining How AI Descriptions Influence Perceptions of Fertility Tracking Applications\". Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies. 7 (4): 1-24. doi:10.1145/3631414.\n\n• ^ Power, Jennifer; Pym, Tinonee; James, Alexandra; Waling, Andrea (5 July 2024). \"Smart Sex Toys: A Narrative Review of Recent Research on Cultural, Health and Safety Considerations\". Current Sexual Health Reports. 16 (3): 199-215. doi:10.1007/s11930-024-00392-3. ISSN 1548-3592.\n\n• ^ Marcantonio, Tiffany L.; Avery, Gracie; Thrash, Anna; Leone, Ruschelle M. (10 September 2024). \"Large Language Models in an App: Conducting a Qualitative Synthetic Data Analysis of How Snapchat's 'My AI' Responds to Questions About Sexual Consent, Sexual Refusals, Sexual Assault, and Sexting\". The Journal of Sex Research. 62 (9): 1905-1919. doi:10.1080/00224499.2024.2396457. PMC 11891083. PMID 39254628.\n\n• ^ Hanson, Kenneth R.; Bolthouse, Hannah (2024). \"\"Replika Removing Erotic Role-Play Is Like Grand Theft Auto Removing Guns or Cars\": Reddit Discourse on Artificial Intelligence Chatbots and Sexual Technologies\". Socius: Sociological Research for a Dynamic World. 10 23780231241259627. doi:10.1177/23780231241259627. ISSN 2378-0231.\n\n• ^ Mania, Karolina (2024). \"Legal Protection of Revenge and Deepfake Porn Victims in the European Union: Findings from a Comparative Legal Study\". Trauma, Violence, & Abuse. 25 (1): 117-129. doi:10.1177/15248380221143772. PMID 36565267.\n\n• ^ Singh, Suyesha; Nambiar, Vaishnavi (2024). \"Role of Artificial Intelligence in the Prevention of Online Child Sexual Abuse: A Systematic Review of Literature\". Journal of Applied Security Research. 19 (4): 586-627. doi:10.1080/19361610.2024.2331885.\n\n• ^ Razi, Afsaneh; Kim, Seunghyun; Alsoubai, Ashwaq; Stringhini, Gianluca; Solorio, Thamar; De Choudhury, Munmun; Wisniewski, Pamela J. (13 October 2021). \"A Human-Centered Systematic Literature Review of the Computational Approaches for Online Sexual Risk Detection\". Proceedings of the ACM on Human-Computer Interaction. 5 (CSCW2): 1-38. doi:10.1145/3479609.\n\n• ^ Ransbotham, Sam; Kiron, David; Gerbert, Philipp; Reeves, Martin (6 September 2017). \"Reshaping Business With Artificial Intelligence\". MIT Sloan Management Review. Archived from the original on 13 February 2024.\n\n• ^ Sun, Yuran; Zhao, Xilei; Lovreglio, Ruggiero; Kuligowski, Erica (2024). \"AI for large-scale evacuation modeling: Promises and challenges\". Interpretable Machine Learning for the Analysis, Design, Assessment, and Informed Decision Making for Civil Infrastructure. pp. 185-204. doi:10.1016/B978-0-12-824073-1.00014-9. ISBN 978-0-12-824073-1.\n\n• ^ Gomaa, Islam; Adelzadeh, Masoud; Gwynne, Steven; Spencer, Bruce; Ko, Yoon; Bénichou, Noureddine; Ma, Chunyun; Elsagan, Nour; Duong, Dana; Zalok, Ehab; Kinateder, Max (1 November 2021). \"A Framework for Intelligent Fire Detection and Evacuation System\". Fire Technology. 57 (6): 3179-3185. doi:10.1007/s10694-021-01157-3.\n\n• ^ Zhao, Xilei; Lovreglio, Ruggiero; Nilsson, Daniel (1 May 2020). \"Modelling and interpreting pre-evacuation decision-making using machine learning\". Automation in Construction. 113 103140. doi:10.1016/j. autcon.2020.103140. hdl:10179/17315.\n\n• ^ \"India's latest election embraced AI technology. Here are some ways it was used constructively\". PBS News. 12 June 2024. Archived from the original on 17 September 2024. Retrieved 28 October 2024.\n\n• ^ \"Экономист Дарон Асемоглу написал книгу об угрозах искусственного интеллекта - и о том, как правильное управление может обратить его на пользу человечеству Спецкор \"Медузы\" Маргарита Лютова узнала у ученого, как скоро мир сможет приблизиться к этой утопии\". Meduza (in Russian). Archived from the original on 20 June 2023. Retrieved 21 June 2023.\n\n• ^ \"Learning, thinking, artistic collaboration and other such human endeavours in the age of AI\". The Hindu. 2 June 2023. Archived from the original on 21 June 2023. Retrieved 21 June 2023.\n\n• ^ Müller, Vincent C. (30 April 2020). \"Ethics of Artificial Intelligence and Robotics\". Stanford Encyclopedia of Philosophy Archive. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ Simonite (2016).\n\n• ^ Russell & Norvig (2021), p. 987.\n\n• ^ \"Assessing potential future artificial intelligence risks, benefits and policy imperatives\". OECD. 14 November 2024. Retrieved 1 August 2025.\n\n• ^ Laskowski (2023).\n\n• ^ GAO (2022).\n\n• ^ Valinsky (2019).\n\n• ^ Russell & Norvig (2021), p. 991.\n\n• ^ Russell & Norvig (2021), pp. 991-992.\n\n• ^ Christian (2020), p. 63.\n\n• ^ Vincent (2022).\n\n• ^ Kopel, Matthew. \"Copyright Services: Fair Use\". Cornell University Library. Archived from the original on 26 September 2024. Retrieved 26 April 2024.\n\n• ^ Burgess, Matt. \"How to Stop Your Data From Being Used to Train AI\". Wired. ISSN 1059-1028. Archived from the original on 3 October 2024. Retrieved 26 April 2024.\n\n• ^ \"Exclusive: Multiple AI companies bypassing web standard to scrape publisher sites, licensing firm says\". Reuters. Archived from the original on 10 November 2024. Retrieved 13 November 2025.\n\n• ^ Shilov, Anton (21 June 2024). \"Several AI companies said to be ignoring robots dot txt exclusion, scraping content without permission: report\". Tom's Hardware. Retrieved 13 November 2025.\n\n• ^ Reisner (2023).\n\n• ^ Alter & Harris (2023).\n\n• ^ \"Getting the Innovation Ecosystem Ready for AI. An IP policy toolkit\" (PDF). WIPO.\n\n• ^ Hammond, George (27 December 2023). \"Big Tech is spending more than VC firms on AI startups\". Ars Technica. Archived from the original on 10 January 2024.\n\n• ^ Wong, Matteo (24 October 2023). \"The Future of AI Is GOMA\". The Atlantic. Archived from the original on 5 January 2024.\n\n• ^ \"Big tech and the pursuit of AI dominance\". The Economist. 26 March 2023. Archived from the original on 29 December 2023.\n\n• ^ Fung, Brian (19 December 2023). \"Where the battle to dominate AI may be won\". CNN Business. Archived from the original on 13 January 2024.\n\n• ^ Metz, Cade (5 July 2023). \"In the Age of A. I., Tech's Little Guys Need Big Friends\". The New York Times. Archived from the original on 8 July 2024. Retrieved 5 October 2024.\n\n• ^ Bhattarai, Abha; Lerman, Rachel (25 December 2025). \"10 charts that show where the economy is heading / 3. AI related investments\". The Washington Post. Archived from the original on 27 December 2025. Source: MSCI\n\n• ^ \"Electricity 2024 - Analysis\". IEA. 24 January 2024. Retrieved 13 July 2024.\n\n• ^ Calvert, Brian (28 March 2024). \"AI already uses as much energy as a small country. It's only the beginning\". Vox. New York, New York. Archived from the original on 3 July 2024. Retrieved 5 October 2024.\n\n• ^ Halper, Evan; O'Donovan, Caroline (21 June 2024). \"AI is exhausting the power grid. Tech firms are seeking a miracle solution\". Washington Post.\n\n• ^ Davenport, Carly. \"AI Data Centers and the Coming YS Power Demand Surge\" (PDF). Goldman Sachs. Archived from the original (PDF) on 26 July 2024. Retrieved 5 October 2024.\n\n• ^ Ryan, Carol (12 April 2024). \"Energy-Guzzling AI Is Also the Future of Energy Savings\". Wall Street Journal. Dow Jones.\n\n• ^ Hiller, Jennifer (1 July 2024). \"Tech Industry Wants to Lock Up Nuclear Power for AI\". Wall Street Journal. Dow Jones. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ Kendall, Tyler (28 September 2024). \"Nvidia's Huang Says Nuclear Power an Option to Feed Data Centers\". Bloomberg.\n\n• ^ Halper, Evan (20 September 2024). \"Microsoft deal would reopen Three Mile Island nuclear plant to power AI\". Washington Post.\n\n• ^ Hiller, Jennifer (20 September 2024). \"Three Mile Island's Nuclear Plant to Reopen, Help Power Microsoft's AI Centers\". Wall Street Journal. Dow Jones. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ Jump up to: a b c Niva Yadav (19 August 2024). \"Taiwan to stop large data centers in the North, cites insufficient power\". DatacenterDynamics. Archived from the original on 8 November 2024. Retrieved 7 November 2024.\n\n• ^ Jump up to: a b Mochizuki, Takashi; Oda, Shoko (18 October 2024). \"エヌビディア出資の日本企業、原発近くでΑIデータセンター新設検討\". Bloomberg (in Japanese). Archived from the original on 8 November 2024. Retrieved 7 November 2024.\n\n• ^ Jump up to: a b Naureen S Malik and Will Wade (5 November 2024). \"Nuclear-Hungry AI Campuses Need New Plan to Find Power Fast\". Bloomberg.\n\n• ^ \"Energy and AI Executive summary\". International Energy Agency. Retrieved 10 April 2025.\n\n• ^ Nicas (2018).\n\n• ^ Rainie, Lee; Keeter, Scott; Perrin, Andrew (22 July 2019). \"Trust and Distrust in America\". Pew Research Center. Archived from the original on 22 February 2024.\n\n• ^ Kosoff, Maya (8 February 2018). \"YouTube Struggles to Contain Its Conspiracy Problem\". Vanity Fair. Retrieved 10 April 2025.\n\n• ^ Berry, David M. (19 March 2025). \"Synthetic media and computational capitalism: towards a critical theory of artificial intelligence\". AI & Society. 40 (7): 5257-5269. doi:10.1007/s00146-025-02265-2. ISSN 1435-5655.\n\n• ^ \"Unreal: A quantum leap in AI video\". The Week. 17 June 2025. Retrieved 20 June 2025.\n\n• ^ Snow, Jackie (16 June 2025). \"AI video is getting real. Beware what comes next\". Quartz. Retrieved 20 June 2025.\n\n• ^ Chow, Andrew R.; Perrigo, Billy (3 June 2025). \"Google's New AI Tool Generates Convincing Deepfakes of Riots, Conflict, and Election Fraud\". Time. Retrieved 20 June 2025.\n\n• ^ Williams (2023).\n\n• ^ Olanipekun, Samson Olufemi (2025). \"Computational propaganda and misinformation: AI technologies as tools of media manipulation\". World Journal of Advanced Research and Reviews. 25 (1): 911-923. doi:10.30574/wjarr.2025.25.1.0131. ISSN 2581-9615.\n\n• ^ Taylor & Hern (2023).\n\n• ^ Lin, Hause; Czarnek, Gabriela; Lewis, Benjamin; White, Joshua P.; Berinsky, Adam J.; Costello, Thomas; Pennycook, Gordon; Rand, David G. (2025). \"Persuading voters using human-artificial intelligence dialogues\". Nature. 648 (8093): 394-401. Bibcode:2025Natur.648..394L. doi:10.1038/s41586-025-09771-9. PMID 41345316.\n\n• ^ \"To fight AI, we need 'personhood credentials,' say AI firms\". Archived from the original on 24 April 2025. Retrieved 9 May 2025.\n\n• ^ Jump up to: a b Samuel, Sigal (19 April 2022). \"Why it's so damn hard to make AI fair and unbiased\". Vox. Archived from the original on 5 October 2024. Retrieved 24 July 2024.\n\n• ^ Jump up to: a b Rose (2023).\n\n• ^ CNA (2019).\n\n• ^ Mazeika, Mantas; Yin, Xuwang; Tamirisa, Rishub; Lim, Jaehyuk; Lee, Bruce W.; Ren, Richard; Phan, Long; Mu, Norman; Khoja, Adam (2025), Utility Engineering: Analyzing and Controlling Emergent Value Systems in AIs, Figure 16, arXiv:2502.08640\n\n• ^ Goffrey (2008), p. 17.\n\n• ^ Berdahl et al. (2023); Goffrey (2008, p. 17); Rose (2023); Russell & Norvig (2021, p. 995)\n\n• ^ Christian (2020), p. 25.\n\n• ^ Jump up to: a b Russell & Norvig (2021), p. 995.\n\n• ^ Grant & Hill (2023).\n\n• ^ Larson & Angwin (2016).\n\n• ^ Christian (2020), p. 67-70.\n\n• ^ Christian (2020, pp. 67-70); Russell & Norvig (2021, pp. 993-994)\n\n• ^ Russell & Norvig (2021, p. 995); Lipartito (2011, p. 36); Goodman & Flaxman (2017, p. 6); Christian (2020, pp. 39-40, 65)\n\n• ^ Quoted in Christian (2020, p. 65).\n\n• ^ Russell & Norvig (2021, p. 994); Christian (2020, pp. 40, 80-81)\n\n• ^ Quoted in Christian (2020, p. 80)\n\n• ^ Hundt, Andrew; Agnew, William; Zeng, Vicky; Kacianka, Severin; Gombolay, Matthew (21-24 June 2022). \"Robots Enact Malignant Stereotypes\". Proceedings of the 2022 ACM Conference on Fairness, Accountability, and Transparency (FAccT '22). Seoul, South Korea: Association for Computing Machinery. doi:10.1145/3531146.3533138.\n\n• ^ For accessible summaries, see the Georgia Tech release and ScienceDaily coverage of the study's findings.\"Flawed AI Makes Robots Racist, Sexist\". Georgia Tech Research News. 23 June 2022.\n\n• ^ \"Robots turn racist and sexist with flawed AI, study finds\". ScienceDaily. 21 June 2022.\n\n• ^ Sample (2017).\n\n• ^ \"Black Box AI\". 16 June 2023. Archived from the original on 15 June 2024. Retrieved 5 October 2024.\n\n• ^ Christian (2020), p. 110.\n\n• ^ Christian (2020), pp. 88-91.\n\n• ^ Christian (2020, p. 83); Russell & Norvig (2021, p. 997)\n\n• ^ Christian (2020), p. 91.\n\n• ^ Christian (2020), p. 83.\n\n• ^ Verma (2021).\n\n• ^ Rothman (2020).\n\n• ^ Christian (2020), pp. 105-108.\n\n• ^ Christian (2020), pp. 108-112.\n\n• ^ Ropek, Lucas (21 May 2024). \"New Anthropic Research Sheds Light on AI's 'Black Box'\". Gizmodo. Archived from the original on 5 October 2024. Retrieved 23 May 2024.\n\n• ^ Russell & Norvig (2021), p. 989.\n\n• ^ Jump up to: a b Russell & Norvig (2021), pp. 987-990.\n\n• ^ Russell & Norvig (2021), p. 988.\n\n• ^ Robitzski (2018); Sainato (2015)\n\n• ^ Harari (2018).\n\n• ^ Buckley, Chris; Mozur, Paul (22 May 2019). \"How China Uses High-Tech Surveillance to Subdue Minorities\". The New York Times. Archived from the original on 25 November 2019. Retrieved 2 July 2019.\n\n• ^ Whittaker, Zack (3 May 2019). \"Security lapse exposed a Chinese smart city surveillance system\". TechCrunch. Archived from the original on 7 March 2021. Retrieved 14 September 2020.\n\n• ^ Urbina et al. (2022).\n\n• ^ Jump up to: a b McGaughey (2022).\n\n• ^ Ford & Colvin (2015); McGaughey (2022)\n\n• ^ IGM Chicago (2017).\n\n• ^ Arntz, Gregory & Zierahn (2016), p. 33.\n\n• ^ Lohr (2017); Frey & Osborne (2017); Arntz, Gregory & Zierahn (2016, p. 33)\n\n• ^ Zhou, Viola (11 April 2023). \"AI is already taking video game illustrators' jobs in China\". Rest of World. Archived from the original on 21 February 2024. Retrieved 17 August 2023.\n\n• ^ Carter, Justin (11 April 2023). \"China's game art industry reportedly decimated by growing AI use\". Game Developer. Archived from the original on 17 August 2023. Retrieved 17 August 2023.\n\n• ^ Morgenstern (2015).\n\n• ^ Mahdawi (2017); Thompson (2014)\n\n• ^ Ma, Jason (5 July 2025). \"Ford CEO Jim Farley warns AI will wipe out half of white-collar jobs, but the 'essential economy' has a huge shortage of workers\". Fortune. Retrieved 21 October 2025.\n\n• ^ Tarnoff, Ben (4 August 2023). \"Lessons from Eliza\". The Guardian Weekly. pp. 34-39.\n\n• ^ Cellan-Jones (2014).\n\n• ^ Russell & Norvig 2021, p. 1001.\n\n• ^ Bostrom (2014).\n\n• ^ Russell (2019).\n\n• ^ Bostrom (2014); Müller & Bostrom (2014); Bostrom (2015).\n\n• ^ Harari (2023).\n\n• ^ Stewart (2025).\n\n• ^ Müller & Bostrom (2014).\n\n• ^ Leaders' concerns about the existential risks of AI around 2015: Rawlinson (2015), Holley (2015), Gibbs (2014), Sainato (2015)\n\n• ^ \"\"Godfather of artificial intelligence\" talks impact and potential of new AI\". CBS News. 25 March 2023. Archived from the original on 28 March 2023. Retrieved 28 March 2023.\n\n• ^ Pittis, Don (4 May 2023). \"Canadian artificial intelligence leader Geoffrey Hinton piles on fears of computer takeover\". CBC. Archived from the original on 7 July 2024. Retrieved 5 October 2024.\n\n• ^ \"'50-50 chance' that AI outsmarts humanity, Geoffrey Hinton says\". Bloomberg BNN. 14 June 2024. Archived from the original on 14 June 2024. Retrieved 6 July 2024.\n\n• ^ Valance (2023).\n\n• ^ Taylor, Josh (7 May 2023). \"Rise of artificial intelligence is inevitable but should not be feared, 'father of AI' says\". The Guardian. Archived from the original on 23 October 2023. Retrieved 26 May 2023.\n\n• ^ Colton, Emma (7 May 2023). \"'Father of AI' says tech fears misplaced: 'You cannot stop it'\". Fox News. Archived from the original on 26 May 2023. Retrieved 26 May 2023.\n\n• ^ Jones, Hessie (23 May 2023). \"Juergen Schmidhuber, Renowned 'Father Of Modern AI,' Says His Life's Work Won't Lead To Dystopia\". Forbes. Archived from the original on 26 May 2023. Retrieved 26 May 2023.\n\n• ^ McMorrow, Ryan (19 December 2023). \"Andrew Ng: 'Do we think the world is better off with more or less intelligence?'\". Financial Times. Archived from the original on 25 January 2024. Retrieved 30 December 2023.\n\n• ^ Will Douglas Heaven (2 May 2023). \"Geoffrey Hinton tells us why he's now scared of the tech he helped build\". MIT Technology Review. Ideas AI. Retrieved 4 January 2026.\n\n• ^ Levy, Steven (22 December 2023). \"How Not to Be Stupid About AI, With Yann LeCun\". Wired. Archived from the original on 28 December 2023. Retrieved 30 December 2023.\n\n• ^ Arguments that AI is not an imminent risk: Brooks (2014), Geist (2015), Madrigal (2015), Lee (2014)\n\n• ^ Jump up to: a b Christian (2020), pp. 67, 73.\n\n• ^ Yudkowsky (2008).\n\n• ^ Jump up to: a b Anderson & Anderson (2011).\n\n• ^ AAAI (2014).\n\n• ^ Wallach (2010).\n\n• ^ Russell (2019), p. 173.\n\n• ^ Stewart, Ashley; Melton, Monica. \"Hugging Face CEO says he's focused on building a 'sustainable model' for the $4.5 billion open-source-AI startup\". Business Insider. Archived from the original on 25 September 2024. Retrieved 14 April 2024.\n\n• ^ Wiggers, Kyle (9 April 2024). \"Google open sources tools to support AI model development\". TechCrunch. Archived from the original on 10 September 2024. Retrieved 14 April 2024.\n\n• ^ Heaven, Will Douglas (12 May 2023). \"The open-source AI boom is built on Big Tech's handouts. How long will it last?\". MIT Technology Review. Retrieved 14 April 2024.\n\n• ^ Brodsky, Sascha (19 December 2023). \"Mistral AI's New Language Model Aims for Open Source Supremacy\". AI Business. Archived from the original on 5 September 2024. Retrieved 5 October 2024.\n\n• ^ Edwards, Benj (22 February 2024). \"Stability announces Stable Diffusion 3, a next-gen AI image generator\". Ars Technica. Archived from the original on 5 October 2024. Retrieved 14 April 2024.\n\n• ^ Marshall, Matt (29 January 2024). \"How enterprises are using open source LLMs: 16 examples\". VentureBeat. Archived from the original on 26 September 2024. Retrieved 5 October 2024.\n\n• ^ Piper, Kelsey (2 February 2024). \"Should we make our most powerful AI models open source to all?\". Vox. Archived from the original on 5 October 2024. Retrieved 14 April 2024.\n\n• ^ Alan Turing Institute (2019). \"Understanding artificial intelligence ethics and safety\" (PDF). Archived (PDF) from the original on 11 September 2024. Retrieved 5 October 2024.\n\n• ^ Alan Turing Institute (2023). \"AI Ethics and Governance in Practice\" (PDF). Archived (PDF) from the original on 11 September 2024. Retrieved 5 October 2024.\n\n• ^ Floridi, Luciano; Cowls, Josh (23 June 2019). \"A Unified Framework of Five Principles for AI in Society\". Harvard Data Science Review. 1 (1). doi:10.1162/99608f92.8cd550d1.\n\n• ^ Buruk, Banu; Ekmekci, Perihan Elif; Arda, Berna (1 September 2020). \"A critical perspective on guidelines for responsible and trustworthy artificial intelligence\". Medicine, Health Care and Philosophy. 23 (3): 387-399. doi:10.1007/s11019-020-09948-1. PMID 32236794.\n\n• ^ Kamila, Manoj Kumar; Jasrotia, Sahil Singh (1 January 2023). \"Ethical issues in the development of artificial intelligence: recognizing the risks\". International Journal of Ethics and Systems. 41 (ahead-of-print): 45-63. doi:10.1108/IJOES-05-2023-0107.\n\n• ^ \"AI Safety Institute releases new AI safety evaluations platform\". UK Government. 10 May 2024. Archived from the original on 5 October 2024. Retrieved 14 May 2024.\n\n• ^ Regulation of AI to mitigate risks: Berryhill et al. (2019), Barfield & Pagallo (2018), Iphofen & Kritikos (2019), Wirtz, Weyerer & Geyer (2018), Buiten (2019)\n\n• ^ Law Library of Congress (U. S.). Global Legal Research Directorate (2019).\n\n• ^ Jump up to: a b Vincent (2023).\n\n• ^ Stanford University (2023).\n\n• ^ Jump up to: a b c d UNESCO (2021).\n\n• ^ Kissinger (2021).\n\n• ^ Altman, Brockman & Sutskever (2023).\n\n• ^ VOA News (25 October 2023). \"UN Announces Advisory Body on Artificial Intelligence\". Voice of America. Archived from the original on 18 September 2024. Retrieved 5 October 2024.\n\n• ^ \"AI Act enters into force - European Commission\". commission. europa. eu. Retrieved 11 August 2025.\n\n• ^ \"Council of Europe opens first ever global treaty on AI for signature\". Council of Europe. 5 September 2024. Archived from the original on 17 September 2024. Retrieved 17 September 2024.\n\n• ^ Edwards (2023).\n\n• ^ Kasperowicz (2023).\n\n• ^ Fox News (2023).\n\n• ^ Milmo, Dan (3 November 2023). \"Hope or Horror? The great AI debate dividing its pioneers\". The Guardian Weekly. pp. 10-12.\n\n• ^ \"The Bletchley Declaration by Countries Attending the AI Safety Summit, 1-2 November 2023\". GOV. UK. 1 November 2023. Archived from the original on 1 November 2023. Retrieved 2 November 2023.\n\n• ^ \"Countries agree to safe and responsible development of frontier AI in landmark Bletchley Declaration\". GOV. UK (Press release). Archived from the original on 1 November 2023. Retrieved 1 November 2023.\n\n• ^ \"Second global AI summit secures safety commitments from companies\". Reuters. 21 May 2024. Retrieved 23 May 2024.\n\n• ^ \"Frontier AI Safety Commitments, AI Seoul Summit 2024\". gov. uk. 21 May 2024. Archived from the original on 23 May 2024. Retrieved 23 May 2024.\n\n• ^ Jump up to: a b Buntz, Brian (3 November 2024). \"Quality vs. quantity: US and China chart different paths in global AI patent race in 2024 / Geographical breakdown of AI patents in 2024\". Research & Development World. R&D World. Archived from the original on 9 December 2024.\n\n• ^ Jump up to: a b Russell & Norvig 2021, p. 9.\n\n• ^ Jump up to: a b c Copeland, J., ed. (2004). The Essential Turing: the ideas that gave birth to the computer age. Oxford, England: Clarendon Press. ISBN 0-1982-5079-7.\n\n• ^ \"Google books ngram\". Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ AI's immediate precursors: McCorduck (2004, pp. 51-107), Crevier (1993, pp. 27-32), Russell & Norvig (2021, pp. 8-17), Moravec (1988, p. 3)\n\n• ^ Jump up to: a b Turing's original publication of the Turing test in \"Computing machinery and intelligence\": Turing (1950)\nHistorical influence and philosophical implications: Haugeland (1985, pp. 6-9), Crevier (1993, p. 24), McCorduck (2004, pp. 70-71), Russell & Norvig (2021, pp. 2, 984)\n\n• ^ Crevier (1993), pp. 47-49.\n\n• ^ Russell & Norvig (2003), p. 17.\n\n• ^ Russell & Norvig (2003), p. 18.\n\n• ^ Newquist (1994), pp. 86-86.\n\n• ^ Simon (1965, p. 96) quoted in Crevier (1993, p. 109)\n\n• ^ Minsky (1967, p. 2) quoted in Crevier (1993, p. 109)\n\n• ^ Russell & Norvig (2021), p. 21.\n\n• ^ Lighthill (1973).\n\n• ^ NRC 1999, pp. 212-213.\n\n• ^ Russell & Norvig (2021), p. 22.\n\n• ^ Expert systems: Russell & Norvig (2021, pp. 23, 292), Luger & Stubblefield (2004, pp. 227-331), Nilsson (1998, chpt. 17.4), McCorduck (2004, pp. 327-335, 434-435), Crevier (1993, pp. 145-162, 197-203), Newquist (1994, pp. 155-183)\n\n• ^ Russell & Norvig (2021), p. 24.\n\n• ^ Nilsson (1998), p. 7.\n\n• ^ McCorduck (2004), pp. 454-462.\n\n• ^ Moravec (1988).\n\n• ^ Jump up to: a b Brooks (1990).\n\n• ^ Developmental robotics: Weng et al. (2001), Lungarella et al. (2003), Asada et al. (2009), Oudeyer (2010)\n\n• ^ Russell & Norvig (2021), p. 25.\n\n• ^ Crevier (1993, pp. 214-215), Russell & Norvig (2021, pp. 24, 26)\n\n• ^ Russell & Norvig (2021), p. 26.\n\n• ^ Formal and narrow methods adopted in the 1990s: Russell & Norvig (2021, pp. 24-26), McCorduck (2004, pp. 486-487)\n\n• ^ AI widely used in the late 1990s: Kurzweil (2005, p. 265), NRC (1999, pp. 216-222), Newquist (1994, pp. 189-201)\n\n• ^ Wong (2023).\n\n• ^ Moore's Law and AI: Russell & Norvig (2021, pp. 14, 27)\n\n• ^ Jump up to: a b c Clark (2015b).\n\n• ^ Big data: Russell & Norvig (2021, p. 26)\n\n• ^ Sagar, Ram (3 June 2020). \"OpenAI Releases GPT-3, The Largest Model So Far\". Analytics India Magazine. Archived from the original on 4 August 2020. Retrieved 15 March 2023.\n\n• ^ Milmo, Dan (2 February 2023). \"ChatGPT reaches 100 million users two months after launch\". The Guardian. ISSN 0261-3077. Archived from the original on 3 February 2023. Retrieved 31 December 2024.\n\n• ^ Gorichanaz, Tim (29 November 2023). \"ChatGPT turns 1: AI chatbot's success says as much about humans as technology\". The Conversation. Archived from the original on 31 December 2024. Retrieved 31 December 2024.\n\n• ^ DiFeliciantonio (2023).\n\n• ^ Goswami (2023).\n\n• ^ \"Nearly 1 in 4 new startups is an AI company\". PitchBook. 24 December 2024. Retrieved 3 January 2025.\n\n• ^ Grayling, Anthony; Ball, Brian (1 August 2024). \"Philosophy is crucial in the age of AI\". The Conversation. Archived from the original on 5 October 2024. Retrieved 4 October 2024.\n\n• ^ Jump up to: a b Jarow, Oshan (15 June 2024). \"Will AI ever become conscious? It depends on how you think about biology\". Vox. Archived from the original on 21 September 2024. Retrieved 4 October 2024.\n\n• ^ McCarthy, John. \"The Philosophy of AI and the AI of Philosophy\". jmc. stanford. edu. Archived from the original on 23 October 2018. Retrieved 3 October 2024.\n\n• ^ Jump up to: a b Turing (1950), p. 1.\n\n• ^ Turing (1950), Under \"The Argument from Consciousness\".\n\n• ^ Kirk-Giannini, Cameron Domenico; Goldstein, Simon (16 October 2023). \"AI is closer than ever to passing the Turing test for 'intelligence'. What happens when it does?\". The Conversation. Archived from the original on 25 September 2024. Retrieved 17 August 2024.\n\n• ^ Russell & Norvig (2021), p. 3.\n\n• ^ Maker (2006).\n\n• ^ McCarthy (1999).\n\n• ^ Minsky (1986).\n\n• ^ Suchman, Lucy (2023). \"The uncontroversial 'thingness' of AI\". Big Data & Society. 10 (2) 20539517231206794. doi:10.1177/20539517231206794.\n\n• ^ Rehak, Rainer (2025). \"AI Narrative Breakdown. A Critical Assessment of Power and Promise\". Proceedings of the 2025 ACM Conference on Fairness, Accountability, and Transparency. pp. 1250-1260. doi:10.1145/3715275.3732083. ISBN 979-8-4007-1482-5.\n\n• ^ Musser, George (1 September 2023). \"How AI Knows Things No One Told It\". Scientific American. Retrieved 17 July 2025.\n\n• ^ \"AI or BS? How to tell if a marketing tool really uses artificial intelligence\". The Drum. Retrieved 31 July 2024.\n\n• ^ Information technology - Artificial intelligence - Artificial intelligence concepts and terminology, BSI British Standards, doi:10.3403/30467396\n\n• ^ \"Regulation - EU - 2024/1689 - EN - EUR-Lex\". eur-lex. europa. eu. Retrieved 30 January 2026.\n\n• ^ Tabassi, Elham (26 January 2023). Artificial Intelligence Risk Management Framework (AI RMF 1.0) (Report). Gaithersburg, MD: National Institute of Standards and Technology (U. S.). doi:10.6028/nist. ai.100-1.\n\n• ^ Nilsson (1983), p. 10.\n\n• ^ Haugeland (1985), pp. 112-117.\n\n• ^ Physical symbol system hypothesis: Newell & Simon (1976, p. 116)\nHistorical significance: McCorduck (2004, p. 153), Russell & Norvig (2021, p. 19)\n\n• ^ Moravec's paradox: Moravec (1988, pp. 15-16), Minsky (1986, p. 29), Pinker (2007, pp. 190-191)\n\n• ^ Dreyfus' critique of AI: Dreyfus (1972), Dreyfus & Dreyfus (1986)\nHistorical significance and philosophical implications: Crevier (1993, pp. 120-132), McCorduck (2004, pp. 211-239), Russell & Norvig (2021, pp. 981-982), Fearn (2007, chpt. 3)\n\n• ^ Crevier (1993), p. 125.\n\n• ^ Langley (2011).\n\n• ^ Katz (2012).\n\n• ^ Neats vs. scruffies, the historic debate: McCorduck (2004, pp. 421-424, 486-489), Crevier (1993, p. 168), Nilsson (1983, pp. 10-11), Russell & Norvig (2021, p. 24)\nA classic example of the \"scruffy\" approach to intelligence: Minsky (1986)\nA modern example of neat AI and its aspirations in the 21st century: Domingos (2015)\n\n• ^ Pennachin & Goertzel (2007).\n\n• ^ Jump up to: a b Roberts (2016).\n\n• ^ Russell & Norvig (2021), p. 986.\n\n• ^ Chalmers (1995).\n\n• ^ Dennett (1991).\n\n• ^ Horst (2005).\n\n• ^ Searle (1999).\n\n• ^ Searle (1980), p. 1.\n\n• ^ Russell & Norvig (2021), p. 9817.\n\n• ^ Searle's Chinese room argument: Searle (1980). Searle's original presentation of the thought experiment., Searle (1999).\nDiscussion: Russell & Norvig (2021, pp. 985), McCorduck (2004, pp. 443-445), Crevier (1993, pp. 269-271)\n\n• ^ Leith, Sam (7 July 2022). \"Nick Bostrom: How can we be certain a machine isn't conscious?\". The Spectator. Archived from the original on 26 September 2024. Retrieved 23 February 2024.\n\n• ^ Jump up to: a b c Thomson, Jonny (31 October 2022). \"Why don't robots have rights?\". Big Think. Archived from the original on 13 September 2024. Retrieved 23 February 2024.\n\n• ^ Jump up to: a b Kateman, Brian (24 July 2023). \"AI Should Be Terrified of Humans\". Time. Archived from the original on 25 September 2024. Retrieved 23 February 2024.\n\n• ^ Wong, Jeff (10 July 2023). \"What leaders need to know about robot rights\". Fast Company.\n\n• ^ Hern, Alex (12 January 2017). \"Give robots 'personhood' status, EU committee argues\". The Guardian. ISSN 0261-3077. Archived from the original on 5 October 2024. Retrieved 23 February 2024.\n\n• ^ Dovey, Dana (14 April 2018). \"Experts Don't Think Robots Should Have Rights\". Newsweek. Archived from the original on 5 October 2024. Retrieved 23 February 2024.\n\n• ^ Cuddy, Alice (13 April 2018). \"Robot rights violate human rights, experts warn EU\". euronews. Archived from the original on 19 September 2024. Retrieved 23 February 2024.\n\n• ^ The Intelligence explosion and technological singularity: Russell & Norvig (2021, pp. 1004-1005), Omohundro (2008), Kurzweil (2005)\n\nI. J. Good's \"intelligence explosion\": Good (1965)\n\nVernor Vinge's \"singularity\": Vinge (1993)\n\n• ^ Russell & Norvig (2021), p. 1005.\n\n• ^ Transhumanism: Moravec (1988), Kurzweil (2005), Russell & Norvig (2021, p. 1005)\n\n• ^ AI as evolution: Edward Fredkin is quoted in McCorduck (2004, p. 401), Butler (1863), Dyson (1998)\n\n• ^ AI in myth: McCorduck (2004, pp. 4-5)\n\n• ^ McCorduck (2004), pp. 340-400.\n\n• ^ Buttazzo (2001).\n\n• ^ Anderson (2008).\n\n• ^ McCauley (2007).\n\n• ^ Galvan (1997).\n\n### Textbooks\n\n• Luger, George; Stubblefield, William (2004). Artificial Intelligence: Structures and Strategies for Complex Problem Solving (5th ed.). Benjamin/Cummings. ISBN 978-0-8053-4780-7. Archived from the original on 26 July 2020. Retrieved 17 December 2019.\n\n• Nilsson, Nils (1998). Artificial Intelligence: A New Synthesis. Morgan Kaufmann. ISBN 978-1-5586-0467-4. Archived from the original on 26 July 2020. Retrieved 18 November 2019.\n\n• Poole, David; Mackworth, Alan; Goebel, Randy (1998). Computational Intelligence: A Logical Approach. New York: Oxford University Press. ISBN 978-0-1951-0270-3. Archived from the original on 26 July 2020. Retrieved 22 August 2020. Later edition: Poole, David; Mackworth, Alan (2017). Artificial Intelligence: Foundations of Computational Agents (2nd ed.). Cambridge University Press. ISBN 978-1-1071-9539-4. Archived from the original on 7 December 2017. Retrieved 6 December 2017.\n\n• Rich, Elaine; Knight, Kevin; Nair, Shivashankar (2010). Artificial Intelligence (3rd ed.). New Delhi: Tata McGraw Hill India. ISBN 978-0-0700-8770-5.\n\n• Russell, Stuart J.; Norvig, Peter (2021). Artificial Intelligence: A Modern Approach (4th ed.). Hoboken: Pearson. ISBN 978-0-1346-1099-3. LCCN 20190474.\n\n• Russell, Stuart J.; Norvig, Peter (2003), Artificial Intelligence: A Modern Approach (2nd ed.), Upper Saddle River, New Jersey: Prentice Hall, ISBN 0-13-790395-2.\n\n### History of AI\n\n• Crevier, Daniel (1993). AI: The Tumultuous Search for Artificial Intelligence. New York, NY: BasicBooks. ISBN 0-465-02997-3.\n\n• McCorduck, Pamela (2004), Machines Who Think (2nd ed.), Natick, Massachusetts: A. K. Peters, ISBN 1-5688-1205-1\n\n• Newquist, H. P. (1994). The Brain Makers: Genius, Ego, And Greed In The Quest For Machines That Think. New York: Macmillan/SAMS. ISBN 978-0-6723-0412-5.\n\n### Other sources\n\n• AI & ML in Fusion\n\n• AI & ML in Fusion, video lecture Archived 2 July 2023 at the Wayback Machine\n\n• Alter, Alexandra; Harris, Elizabeth A. (20 September 2023), \"Franzen, Grisham and Other Prominent Authors Sue OpenAI\", The New York Times, archived from the original on 14 September 2024, retrieved 5 October 2024\n\n• Altman, Sam; Brockman, Greg; Sutskever, Ilya (22 May 2023). \"Governance of Superintelligence\". openai. com. Archived from the original on 27 May 2023. Retrieved 27 May 2023.\n\n• Anderson, Susan Leigh (2008). \"Asimov's 'three laws of robotics' and machine metaethics\". AI & Society. 22 (4): 477-493. doi:10.1007/s00146-007-0094-5.\n\n• Anderson, Michael; Anderson, Susan Leigh (2011). Machine Ethics. Cambridge University Press.\n\n• Arntz, Melanie; Gregory, Terry; Zierahn, Ulrich (2016), \"The risk of automation for jobs in OECD countries: A comparative analysis\", OECD Social, Employment, and Migration Working Papers 189\n\n• Asada, M.; Hosoda, K.; Kuniyoshi, Y.; Ishiguro, H.; Inui, T.; Yoshikawa, Y.; Ogino, M.; Yoshida, C. (2009). \"Cognitive developmental robotics: a survey\". IEEE Transactions on Autonomous Mental Development. 1 (1): 12-34. Bibcode:2009ITAMD...1...12A. doi:10.1109/tamd.2009.2021702.\n\n• \"Ask the AI experts: What's driving today's progress in AI?\". McKinsey & Company. Archived from the original on 13 April 2018. Retrieved 13 April 2018.\n\n• Barfield, Woodrow; Pagallo, Ugo (2018). Research handbook on the law of artificial intelligence. Cheltenham, UK: Edward Elgar Publishing. ISBN 978-1-7864-3904-8. OCLC 1039480085.\n\n• Beal, J.; Winston, Patrick (2009), \"The New Frontier of Human-Level Artificial Intelligence\", IEEE Intelligent Systems, 24 (4): 21-24, Bibcode:2009IISys..24d..21B, doi:10.1109/MIS.2009.75, hdl:1721.1/52357\n\n• Berdahl, Carl Thomas; Baker, Lawrence; Mann, Sean; Osoba, Osonde; Girosi, Federico (7 February 2023). \"Strategies to Improve the Impact of Artificial Intelligence on Health Equity: Scoping Review\". JMIR AI. 2 e42936. doi:10.2196/42936. PMC 11041459. PMID 38875587.\n\n• Berryhill, Jamie; Heang, Kévin Kok; Clogher, Rob; McBride, Keegan (2019). Hello, World: Artificial Intelligence and its Use in the Public Sector (PDF). Paris: OECD Observatory of Public Sector Innovation. Archived (PDF) from the original on 20 December 2019. Retrieved 9 August 2020.\n\n• Bertini, Marco; Del Bimbo, Alberto; Torniai, Carlo (2006). \"Automatic annotation and semantic retrieval of video sequences using multimedia ontologies\". Proceedings of the 14th ACM international conference on Multimedia. pp. 679-682. doi:10.1145/1180639.1180782. ISBN 1-59593-447-2.\n\n• Bostrom, Nick (2014). Superintelligence: Paths, Dangers, Strategies. Oxford University Press.\n\n• Bostrom, Nick (2015). \"What happens when our computers get smarter than we are?\". TED (conference). Archived from the original on 25 July 2020. Retrieved 30 January 2020.\n\n• Brooks, Rodney (10 November 2014). \"artificial intelligence is a tool, not a threat\". Rethink Robotics. Archived from the original on 12 November 2014.\n\n• Brooks, Rodney A. (1990). \"Elephants don't play chess\". Robotics and Autonomous Systems. 6 (1-2): 3-15. doi:10.1016/S0921-8890(05)80025-9.\n\n• Buiten, Miriam C (2019). \"Towards Intelligent Regulation of Artificial Intelligence\". European Journal of Risk Regulation. 10 (1): 41-59. doi:10.1017/err.2019.8. ISSN 1867-299X.\n\n• Bushwick, Sophie (16 March 2023), \"What the New GPT-4 AI Can Do\", Scientific American, archived from the original on 22 August 2023, retrieved 5 October 2024\n\n• Butler, Samuel (13 June 1863). \"Darwin among the Machines\". Letters to the Editor. The Press. Christchurch, New Zealand. Archived from the original on 19 September 2008. Retrieved 16 October 2014 - via Victoria University of Wellington.\n\n• Buttazzo, G. (July 2001). \"Artificial consciousness: Utopia or real possibility?\". Computer. 34 (7): 24-30. Bibcode:2001Compr..34g..24B. doi:10.1109/2.933500.\n\n• Cambria, Erik; White, Bebo (May 2014). \"Jumping NLP Curves: A Review of Natural Language Processing Research [Review Article]\". IEEE Computational Intelligence Magazine. 9 (2): 48-57. doi:10.1109/MCI.2014.2307227.\n\n• Cellan-Jones, Rory (2 December 2014). \"Stephen Hawking warns artificial intelligence could end mankind\". BBC News. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Chalmers, David (1995). \"Facing up to the problem of consciousness\". Journal of Consciousness Studies. 2 (3): 200-219.\n\n• Challa, Subhash; Moreland, Mark R.; Mušicki, Darko; Evans, Robin J. (2011). Fundamentals of Object Tracking. Cambridge University Press. doi:10.1017/CBO9780511975837. ISBN 978-0-5218-7628-5.\n\n• Christian, Brian (2020). The Alignment Problem: Machine learning and human values. W. W. Norton & Company. ISBN 978-0-3938-6833-3. OCLC 1233266753.\n\n• Ciresan, D.; Meier, U.; Schmidhuber, J. (2012). \"Multi-column deep neural networks for image classification\". 2012 IEEE Conference on Computer Vision and Pattern Recognition. pp. 3642-3649. arXiv:1202.2745. doi:10.1109/cvpr.2012.6248110. ISBN 978-1-4673-1228-8.\n\n• Clark, Jack (2015b). \"Why 2015 Was a Breakthrough Year in Artificial Intelligence\". Bloomberg. com. Archived from the original on 23 November 2016. Retrieved 23 November 2016.\n\n• CNA (12 January 2019). \"Commentary: Bad news. Artificial intelligence is biased\". CNA. Archived from the original on 12 January 2019. Retrieved 19 June 2020.\n\n• Cybenko, G. (1988). Continuous valued neural networks with two hidden layers are sufficient (Report). Department of Computer Science, Tufts University.\n\n• Deng, L.; Yu, D. (2014). \"Deep Learning: Methods and Applications\" (PDF). Foundations and Trends in Signal Processing. 7 (3-4): 197-387. doi:10.1561/2000000039. Archived (PDF) from the original on 14 March 2016. Retrieved 18 October 2014.\n\n• Dennett, Daniel (1991). Consciousness Explained. The Penguin Press. ISBN 978-0-7139-9037-9.\n\n• DiFeliciantonio, Chase (3 April 2023). \"AI has already changed the world. This report shows how\". San Francisco Chronicle. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Dickson, Ben (2 May 2022). \"Machine learning: What is the transformer architecture?\". TechTalks. Archived from the original on 22 November 2023. Retrieved 22 November 2023.\n\n• Domingos, Pedro (2015). The Master Algorithm: How the Quest for the Ultimate Learning Machine Will Remake Our World. Basic Books. ISBN 978-0-4650-6570-7.\n\n• Dreyfus, Hubert (1972). What Computers Can't Do. New York: MIT Press. ISBN 978-0-0601-1082-6.\n\n• Dreyfus, Hubert; Dreyfus, Stuart (1986). Mind over Machine: The Power of Human Intuition and Expertise in the Era of the Computer. Oxford: Blackwell. ISBN 978-0-0290-8060-3. Archived from the original on 26 July 2020. Retrieved 22 August 2020.\n\n• Dyson, George (1998). Darwin among the Machines. Allan Lane Science. ISBN 978-0-7382-0030-9. Archived from the original on 26 July 2020. Retrieved 22 August 2020.\n\n• Edelson, Edward (1991). The Nervous System. New York: Chelsea House. ISBN 978-0-7910-0464-7. Archived from the original on 26 July 2020. Retrieved 18 November 2019.\n\n• Edwards, Benj (17 May 2023). \"Poll: AI poses risk to humanity, according to majority of Americans\". Ars Technica. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Fearn, Nicholas (2007). The Latest Answers to the Oldest Questions: A Philosophical Adventure with the World's Greatest Thinkers. New York: Grove Press. ISBN 978-0-8021-1839-4.\n\n• Ford, Martin; Colvin, Geoff (6 September 2015). \"Will robots create more jobs than they destroy?\". The Guardian. Archived from the original on 16 June 2018. Retrieved 13 January 2018.\n\n• Fox News (2023). \"Fox News Poll\" (PDF). Fox News. Archived (PDF) from the original on 12 May 2023. Retrieved 19 June 2023.\n\n• Frey, Carl Benedikt; Osborne, Michael A (2017). \"The future of employment: How susceptible are jobs to computerisation?\". Technological Forecasting and Social Change. 114: 254-280. doi:10.1016/j. techfore.2016.08.019.\n\n• \"From not working to neural networking\". The Economist. 2016. Archived from the original on 31 December 2016. Retrieved 26 April 2018.\n\n• Galvan, Jill (1 January 1997). \"Entering the Posthuman Collective in Philip K. Dick's \"Do Androids Dream of Electric Sheep?\"\". Science Fiction Studies. 24 (3): 413-429. doi:10.1525/sfs.24.3.0413. JSTOR 4240644.\n\n• Geist, Edward Moore (9 August 2015). \"Is artificial intelligence really an existential threat to humanity?\". Bulletin of the Atomic Scientists. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Gibbs, Samuel (27 October 2014). \"Elon Musk: artificial intelligence is our biggest existential threat\". The Guardian. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Goffrey, Andrew (2008). \"Algorithm\". In Fuller, Matthew (ed.). Software studies: a lexicon. Cambridge, Mass.: MIT Press. pp. 15-20. ISBN 978-1-4356-4787-9.\n\n• Goldman, Sharon (14 September 2022). \"10 years later, deep learning 'revolution' rages on, say AI pioneers Hinton, LeCun and Li\". VentureBeat. Archived from the original on 5 October 2024. Retrieved 8 December 2023.\n\n• Good, I. J. (1965), Speculations Concerning the First Ultraintelligent Machine, archived from the original on 10 July 2023, retrieved 5 October 2024\n\n• Goodfellow, Ian; Bengio, Yoshua; Courville, Aaron (2016), Deep Learning, MIT Press., archived from the original on 16 April 2016, retrieved 12 November 2017\n\n• Goodman, Bryce; Flaxman, Seth (2017). \"EU regulations on algorithmic decision-making and a 'right to explanation'\". AI Magazine. 38 (3): 50. arXiv:1606.08813. doi:10.1609/aimag. v38i3.2741.\n\n• Government Accountability Office (13 September 2022). Consumer Data: Increasing Use Poses Risks to Privacy. gao. gov (Report). Archived from the original on 13 September 2024. Retrieved 5 October 2024.\n\n• Grant, Nico; Hill, Kashmir (22 May 2023). \"Google's Photo App Still Can't Find Gorillas. And Neither Can Apple's\". The New York Times. Archived from the original on 14 September 2024. Retrieved 5 October 2024.\n\n• Goswami, Rohan (5 April 2023). \"Here's where the A. I. jobs are\". CNBC. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Harari, Yuval Noah (October 2018). \"Why Technology Favors Tyranny\". The Atlantic. Archived from the original on 25 September 2021. Retrieved 23 September 2021.\n\n• Harari, Yuval Noah (2023). \"AI and the future of humanity\". YouTube. Archived from the original on 30 September 2024. Retrieved 5 October 2024.\n\n• Haugeland, John (1985). Artificial Intelligence: The Very Idea. Cambridge, Mass.: MIT Press. ISBN 978-0-2620-8153-5.\n\n• Hinton, G.; Deng, L.; Yu, D.; Dahl, G.; Mohamed, A.; Jaitly, N.; Senior, A.; Vanhoucke, V.; Nguyen, P.; Sainath, T.; Kingsbury, B. (2012). \"Deep Neural Networks for Acoustic Modeling in Speech Recognition - The shared views of four research groups\". IEEE Signal Processing Magazine. 29 (6): 82-97. Bibcode:2012ISPM...29...82H. doi:10.1109/msp.2012.2205597.\n\n• Holley, Peter (28 January 2015). \"Bill Gates on dangers of artificial intelligence: 'I don't understand why some people are not concerned'\". The Washington Post. ISSN 0190-8286. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Hornik, Kurt; Stinchcombe, Maxwell; White, Halbert (1989). Multilayer Feedforward Networks are Universal Approximators (PDF). Neural Networks. Vol. 2. Pergamon Press. pp. 359-366. Archived (PDF) from the original on 21 April 2023. Retrieved 5 October 2024.\n\n• Horst, Steven (2005). \"The Computational Theory of Mind\". The Stanford Encyclopedia of Philosophy. Archived from the original on 6 March 2016. Retrieved 7 March 2016.\n\n• Howe, J. (November 1994). \"Artificial Intelligence at Edinburgh University: a Perspective\". Archived from the original on 15 May 2007. Retrieved 30 August 2007.\n\n• IGM Chicago (30 June 2017). \"Robots and Artificial Intelligence\". igmchicago. org. Archived from the original on 1 May 2019. Retrieved 3 July 2019.\n\n• Iphofen, Ron; Kritikos, Mihalis (3 January 2019). \"Regulating artificial intelligence and robotics: ethics by design in a digital society\". Contemporary Social Science. 16 (2): 170-184. doi:10.1080/21582041.2018.1563803. ISSN 2158-2041.\n\n• Jordan, M. I.; Mitchell, T. M. (16 July 2015). \"Machine learning: Trends, perspectives, and prospects\". Science. 349 (6245): 255-260. Bibcode:2015Sci...349..255J. doi:10.1126/science. aaa8415. PMID 26185243.\n\n• Kahneman, Daniel; Slovic, Paul; Tversky, Amos (1982). Judgment Under Uncertainty: Heuristics and Biases. Cambridge University Press.\n\n• Kahneman, Daniel (2011). Thinking, Fast and Slow. Macmillan. ISBN 978-1-4299-6935-2. Archived from the original on 15 March 2023. Retrieved 8 April 2012.\n\n• Kasperowicz, Peter (1 May 2023). \"Regulate AI? GOP much more skeptical than Dems that government can do it right: poll\". Fox News. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Katz, Yarden (1 November 2012). \"Noam Chomsky on Where Artificial Intelligence Went Wrong\". The Atlantic. Archived from the original on 28 February 2019. Retrieved 26 October 2014.\n\n• \"Kismet\". MIT Artificial Intelligence Laboratory, Humanoid Robotics Group. Archived from the original on 17 October 2014. Retrieved 25 October 2014.\n\n• Kissinger, Henry (1 November 2021). \"The Challenge of Being Human in the Age of AI\". The Wall Street Journal. Archived from the original on 4 November 2021. Retrieved 4 November 2021.\n\n• Kobielus, James (27 November 2019). \"GPUs Continue to Dominate the AI Accelerator Market for Now\". InformationWeek. Archived from the original on 19 October 2021. Retrieved 11 June 2020.\n\n• Kuperman, G. J.; Reichley, R. M.; Bailey, T. C. (1 July 2006). \"Using Commercial Knowledge Bases for Clinical Decision Support: Opportunities, Hurdles, and Recommendations\". Journal of the American Medical Informatics Association. 13 (4): 369-371. doi:10.1197/jamia. M2055. PMC 1513681. PMID 16622160.\n\n• Kurzweil, Ray (2005). The Singularity is Near. Penguin Books. ISBN 978-0-6700-3384-3.\n\n• Langley, Pat (2011). \"The changing science of machine learning\". Machine Learning. 82 (3): 275-279. doi:10.1007/s10994-011-5242-y.\n\n• Larson, Jeff; Angwin, Julia (23 May 2016). \"How We Analyzed the COMPAS Recidivism Algorithm\". ProPublica. Archived from the original on 29 April 2019. Retrieved 19 June 2020.\n\n• Laskowski, Nicole (November 2023). \"What is Artificial Intelligence and How Does AI Work? TechTarget\". Enterprise AI. Archived from the original on 5 October 2024. Retrieved 30 October 2023.\n\n• Law Library of Congress (U. S.). Global Legal Research Directorate, issuing body. (2019). Regulation of artificial intelligence in selected jurisdictions. LCCN 2019668143. OCLC 1110727808.\n\n• Lee, Timothy B. (22 August 2014). \"Will artificial intelligence destroy humanity? Here are 5 reasons not to worry\". Vox. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Lenat, Douglas; Guha, R. V. (1989). Building Large Knowledge-Based Systems. Addison-Wesley. ISBN 978-0-2015-1752-1.\n\n• Lighthill, James (1973). \"Artificial Intelligence: A General Survey\". Artificial Intelligence: a paper symposium. Science Research Council.\n\n• Lipartito, Kenneth (6 January 2011), The Narrative and the Algorithm: Genres of Credit Reporting from the Nineteenth Century to Today (PDF) (Unpublished manuscript), SSRN 1736283, archived (PDF) from the original on 9 October 2022\n\n• Lohr, Steve (2017). \"Robots Will Take Jobs, but Not as Fast as Some Fear, New Report Says\". The New York Times. Archived from the original on 14 January 2018. Retrieved 13 January 2018.\n\n• Lungarella, M.; Metta, G.; Pfeifer, R.; Sandini, G. (2003). \"Developmental robotics: a survey\". Connection Science. 15 (4): 151-190. Bibcode:2003ConSc..15..151L. doi:10.1080/09540090310001655110.\n\n• \"Machine Ethics\". aaai. org. Archived from the original on 29 November 2014.\n\n• Madrigal, Alexis C. (27 February 2015). \"The case against killer robots, from a guy actually working on artificial intelligence\". Fusion. net. Archived from the original on 4 February 2016. Retrieved 31 January 2016.\n\n• Mahdawi, Arwa (26 June 2017). \"What jobs will still be around in 20 years? Read this to prepare your future\". The Guardian. Archived from the original on 14 January 2018. Retrieved 13 January 2018.\n\n• Maker, Meg Houston (2006), AI@50: AI Past, Present, Future, Dartmouth College, archived from the original on 8 October 2008, retrieved 16 October 2008\n\n• Marmouyet, Françoise (15 December 2023). \"Google's Gemini: is the new AI model really better than ChatGPT?\". The Conversation. Archived from the original on 4 March 2024. Retrieved 25 December 2023.\n\n• Minsky, Marvin (1986), The Society of Mind, Simon and Schuster\n\n• McCarthy, John; Minsky, Marvin; Rochester, Nathan; Shannon, Claude (1955). \"A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence\". stanford. edu. Archived from the original on 26 August 2007. Retrieved 30 August 2007.\n\n• McCarthy, John (2007), \"From Here to Human-Level AI\", Artificial Intelligence, p. 171\n\n• McCarthy, John (1999), What is AI?, archived from the original on 4 December 2022, retrieved 4 December 2022\n\n• McCauley, Lee (2007). \"AI armageddon and the three laws of robotics\". Ethics and Information Technology. 9 (2): 153-164. doi:10.1007/s10676-007-9138-2. ProQuest 222198675.\n\n• McGarry, Ken (1 December 2005). \"A survey of interestingness measures for knowledge discovery\". The Knowledge Engineering Review. 20 (1): 39-61. doi:10.1017/S0269888905000408.\n\n• McGaughey, Ewan (2022). \"Will Robots Automate Your Job Away? Full Employment, Basic Income and Economic Democracy\". Industrial Law Journal. 51 (3): 511-559. doi:10.1093/indlaw/dwab010. SSRN 3044448.\n\n• Merkle, Daniel; Middendorf, Martin (2013). \"Swarm Intelligence\". In Burke, Edmund K.; Kendall, Graham (eds.). Search Methodologies: Introductory Tutorials in Optimization and Decision Support Techniques. Springer Science & Business Media. ISBN 978-1-4614-6940-7.\n\n• Minsky, Marvin (1967), Computation: Finite and Infinite Machines, Englewood Cliffs, N. J.: Prentice-Hall\n\n• Moravec, Hans (1988). Mind Children. Harvard University Press. ISBN 978-0-6745-7616-2. Archived from the original on 26 July 2020. Retrieved 18 November 2019.\n\n• Morgenstern, Michael (9 May 2015). \"Automation and anxiety\". The Economist. Archived from the original on 12 January 2018. Retrieved 13 January 2018.\n\n• Müller, Vincent C.; Bostrom, Nick (2014). \"Future Progress in Artificial Intelligence: A Poll Among Experts\". AI Matters. 1 (1): 9-11. doi:10.1145/2639475.2639478.\n\n• Neumann, Bernd; Möller, Ralf (January 2008). \"On scene interpretation with description logics\". Image and Vision Computing. 26 (1): 82-101. doi:10.1016/j. imavis.2007.08.013.\n\n• Nilsson, Nils (1995), \"Eyes on the Prize\", AI Magazine, vol. 16, pp. 9-17\n\n• Newell, Allen; Simon, H. A. (1976). \"Computer Science as Empirical Inquiry: Symbols and Search\". Communications of the ACM. 19 (3): 113-126. doi:10.1145/360018.360022.\n\n• Nicas, Jack (7 February 2018). \"How YouTube Drives People to the Internet's Darkest Corners\". The Wall Street Journal. ISSN 0099-9660. Archived from the original on 5 October 2024. Retrieved 16 June 2018.\n\n• Nilsson, Nils (1983). \"Artificial Intelligence Prepares for 2001\" (PDF). AI Magazine. 1 (1). Archived (PDF) from the original on 17 August 2020. Retrieved 22 August 2020. Presidential Address to the Association for the Advancement of Artificial Intelligence.\n\n• NRC (United States National Research Council) (1999). \"Developments in Artificial Intelligence\". Funding a Revolution: Government Support for Computing Research. National Academies Press. ISBN 978-0-309-52501-5.\n\n• Omohundro, Steve (2008). The Nature of Self-Improving Artificial Intelligence (PDF). 2007 Singularity Summit. San Francisco, CA.\n\n• Oudeyer, P-Y. (2010). \"On the impact of robotics in behavioral and cognitive sciences: from insect navigation to human cognitive development\". IEEE Transactions on Autonomous Mental Development. 2 (1): 2-16. Bibcode:2010ITAMD...2....2O. doi:10.1109/tamd.2009.2039057.\n\n• Pennachin, C.; Goertzel, B. (2007). \"Contemporary Approaches to Artificial General Intelligence\". Artificial General Intelligence. Cognitive Technologies. Berlin, Heidelberg: Springer. pp. 1-30. doi:10.1007/978-3-540-68677-4_1. ISBN 978-3-5402-3733-4.\n\n• Pinker, Steven (2007) [1994], The Language Instinct, Perennial Modern Classics, Harper, ISBN 978-0-0613-3646-1\n\n• Poria, Soujanya; Cambria, Erik; Bajpai, Rajiv; Hussain, Amir (September 2017). \"A review of affective computing: From unimodal analysis to multimodal fusion\". Information Fusion. 37: 98-125. Bibcode:2017InfFu..37...98P. doi:10.1016/j. inffus.2017.02.003. hdl:1893/25490.\n\n• Rawlinson, Kevin (29 January 2015). \"Microsoft's Bill Gates insists AI is a threat\". BBC News. Archived from the original on 29 January 2015. Retrieved 30 January 2015.\n\n• Reisner, Alex (19 August 2023), \"Revealed: The Authors Whose Pirated Books are Powering Generative AI\", The Atlantic, archived from the original on 3 October 2024, retrieved 5 October 2024\n\n• Roberts, Jacob (2016). \"Thinking Machines: The Search for Artificial Intelligence\". Distillations. Vol. 2, no. 2. pp. 14-23. Archived from the original on 19 August 2018. Retrieved 20 March 2018.\n\n• Robitzski, Dan (5 September 2018). \"Five experts share what scares them the most about AI\". Futurism. Archived from the original on 8 December 2019. Retrieved 8 December 2019.\n\n• Rose, Steve (11 July 2023). \"AI Utopia or dystopia?\". The Guardian Weekly. pp. 42-43.\n\n• Russell, Stuart (2019). Human Compatible: Artificial Intelligence and the Problem of Control. United States: Viking. ISBN 978-0-5255-5861-3. OCLC 1083694322.\n\n• Sainato, Michael (19 August 2015). \"Stephen Hawking, Elon Musk, and Bill Gates Warn About Artificial Intelligence\". Observer. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Sample, Ian (5 November 2017). \"Computer says no: why making AIs fair, accountable and transparent is crucial\". The Guardian. Archived from the original on 10 October 2022. Retrieved 30 January 2018.\n\n• Rothman, Denis (7 October 2020). \"Exploring LIME Explanations and the Mathematics Behind It\". Codemotion. Archived from the original on 25 November 2023. Retrieved 25 November 2023.\n\n• Scassellati, Brian (2002). \"Theory of mind for a humanoid robot\". Autonomous Robots. 12 (1): 13-24. doi:10.1023/A:1013298507114.\n\n• Schmidhuber, J. (2015). \"Deep Learning in Neural Networks: An Overview\". Neural Networks. 61: 85-117. arXiv:1404.7828. Bibcode:2015NN.....61...85S. doi:10.1016/j. neunet.2014.09.003. PMID 25462637.\n\n• Schmidhuber, Jürgen (2022). \"Annotated History of Modern AI and Deep Learning\". Archived from the original on 7 August 2023. Retrieved 5 October 2024.\n\n• Searle, John (1980). \"Minds, Brains and Programs\". Behavioral and Brain Sciences. 3 (3): 417-457. doi:10.1017/S0140525X00005756.\n\n• Searle, John (1999). Mind, language and society. New York: Basic Books. ISBN 978-0-4650-4521-1. OCLC 231867665. Archived from the original on 26 July 2020. Retrieved 22 August 2020.\n\n• Simon, H. A. (1965), The Shape of Automation for Men and Management, New York: Harper & Row, OCLC 1483817127\n\n• Simonite, Tom (31 March 2016). \"How Google Plans to Solve Artificial Intelligence\". MIT Technology Review. Archived from the original on 16 September 2024. Retrieved 5 October 2024.\n\n• Smith, Craig S. (15 March 2023). \"ChatGPT-4 Creator Ilya Sutskever on AI Hallucinations and AI Democracy\". Forbes. Archived from the original on 18 September 2024. Retrieved 25 December 2023.\n\n• Smoliar, Stephen W.; Zhang, HongJiang (1994). \"Content based video indexing and retrieval\". IEEE MultiMedia. 1 (2): 62-72. doi:10.1109/93.311653.\n\n• Solomonoff, Ray (1956). An Inductive Inference Machine (PDF). Dartmouth Summer Research Conference on Artificial Intelligence. Archived (PDF) from the original on 26 April 2011. Retrieved 22 March 2011 - via std. com, pdf scanned copy of the original. Later published as\n\nSolomonoff, Ray (1957). \"An Inductive Inference Machine\". IRE Convention Record. Vol. Section on Information Theory, part 2. pp. 56-62.\n\n• Stanford University (2023). \"Artificial Intelligence Index Report 2023/Chapter 6: Policy and Governance\" (PDF). AI Index. Archived (PDF) from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Stewart, Jon (9 October 2025). \"AI: What Could Go Wrong? With Geoffrey Hinton\". The Weekly Show with Jon Stewart (Podcast).\n\n• Tao, Jianhua; Tan, Tieniu (2005). Affective Computing and Intelligent Interaction. Affective Computing: A Review. Lecture Notes in Computer Science. Vol. 3784. Springer. pp. 981-995. doi:10.1007/11573548. ISBN 978-3-5402-9621-8.\n\n• Taylor, Josh; Hern, Alex (2 May 2023). \"'Godfather of AI' Geoffrey Hinton quits Google and warns over dangers of misinformation\". The Guardian. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• Thompson, Derek (23 January 2014). \"What Jobs Will the Robots Take?\". The Atlantic. Archived from the original on 24 April 2018. Retrieved 24 April 2018.\n\n• Thro, Ellen (1993). Robotics: The Marriage of Computers and Machines. New York: Facts on File. ISBN 978-0-8160-2628-9. Archived from the original on 26 July 2020. Retrieved 22 August 2020.\n\n• Toews, Rob (3 September 2023). \"Transformers Revolutionized AI. What Will Replace Them?\". Forbes. Archived from the original on 8 December 2023. Retrieved 8 December 2023.\n\n• Turing, Alan (October 1950). \"Computing Machinery and Intelligence\". Mind. 59 (236): 433-460. doi:10.1093/mind/LIX.236.433. ISSN 1460-2113. JSTOR 2251299. S2CID 14636783.\n\n• UNESCO Science Report: the Race Against Time for Smarter Development. Paris: UNESCO. 2021. ISBN 978-9-2310-0450-6. Archived from the original on 18 June 2022. Retrieved 18 September 2021.\n\n• Urbina, Fabio; Lentzos, Filippa; Invernizzi, Cédric; Ekins, Sean (7 March 2022). \"Dual use of artificial-intelligence-powered drug discovery\". Nature Machine Intelligence. 4 (3): 189-191. doi:10.1038/s42256-022-00465-9. PMC 9544280. PMID 36211133.\n\n• Valance, Christ (30 May 2023). \"Artificial intelligence could lead to extinction, experts warn\". BBC News. Archived from the original on 17 June 2023. Retrieved 18 June 2023.\n\n• Valinsky, Jordan (11 April 2019), \"Amazon reportedly employs thousands of people to listen to your Alexa conversations\", CNN. com, archived from the original on 26 January 2024, retrieved 5 October 2024\n\n• Verma, Yugesh (25 December 2021). \"A Complete Guide to SHAP - SHAPley Additive exPlanations for Practitioners\". Analytics India Magazine. Archived from the original on 25 November 2023. Retrieved 25 November 2023.\n\n• Vincent, James (7 November 2019). \"OpenAI has published the text-generating AI it said was too dangerous to share\". The Verge. Archived from the original on 11 June 2020. Retrieved 11 June 2020.\n\n• Vincent, James (15 November 2022). \"The scary truth about AI copyright is nobody knows what will happen next\". The Verge. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Vincent, James (3 April 2023). \"AI is entering an era of corporate control\". The Verge. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Vinge, Vernor (1993). \"The Coming Technological Singularity: How to Survive in the Post-Human Era\". Vision 21: Interdisciplinary Science and Engineering in the Era of Cyberspace: 11. Bibcode:1993vise. nasa...11V. Archived from the original on 1 January 2007. Retrieved 14 November 2011.\n\n• Waddell, Kaveh (2018). \"Chatbots Have Entered the Uncanny Valley\". The Atlantic. Archived from the original on 24 April 2018. Retrieved 24 April 2018.\n\n• Wallach, Wendell (2010). Moral Machines. Oxford University Press.\n\n• Wason, P. C.; Shapiro, D. (1966). \"Reasoning\". In Foss, B. M. (ed.). New horizons in psychology. Harmondsworth: Penguin. Archived from the original on 26 July 2020. Retrieved 18 November 2019.\n\n• Weng, J.; McClelland; Pentland, A.; Sporns, O.; Stockman, I.; Sur, M.; Thelen, E. (2001). \"Autonomous mental development by robots and animals\". Science. 291 (5504): 599-600. doi:10.1126/science.291.5504.599. PMID 11229402.\n\n• \"What is 'fuzzy logic'? Are there computers that are inherently fuzzy and do not apply the usual binary logic?\". Scientific American. 21 October 1999. Archived from the original on 6 May 2018. Retrieved 5 May 2018.\n\n• Williams, Rhiannon (28 June 2023), \"Humans may be more likely to believe disinformation generated by AI\", MIT Technology Review, archived from the original on 16 September 2024, retrieved 5 October 2024\n\n• Wirtz, Bernd W.; Weyerer, Jan C.; Geyer, Carolin (24 July 2018). \"Artificial Intelligence and the Public Sector - Applications and Challenges\". International Journal of Public Administration. 42 (7): 596-615. doi:10.1080/01900692.2018.1498103.\n\n• Wong, Matteo (19 May 2023), \"ChatGPT Is Already Obsolete\", The Atlantic, archived from the original on 18 September 2024, retrieved 5 October 2024\n\n• Yudkowsky, E (2008), \"Artificial Intelligence as a Positive and Negative Factor in Global Risk\" (PDF), Global Catastrophic Risks, Oxford University Press, 2008, Bibcode:2008gcr.. book..303Y, archived (PDF) from the original on 19 October 2013, retrieved 24 September 2021\n\n## External links\n\nArtificial intelligence at Wikipedia's sister projects\n\n• Definitions from Wiktionary\n\n• Media from Commons\n\n• Quotations from Wikiquote\n\n• Textbooks from Wikibooks\n\n• Resources from Wikiversity\n\n• Data from Wikidata\n\nScholia has a topic profile for Artificial intelligence.\n\n• Hauser, Larry. \"Artificial Intelligence\". In Fieser, James; Dowden, Bradley (eds.). Internet Encyclopedia of Philosophy. ISSN 2161-0002. OCLC 37741658.\n\nshow\n\n• v\n\n• t\n\n• e\n\nArtificial intelligence (AI)\n\nshow\nArticles related to artificial intelligence\n\nshow\nAuthority control databases\n\nRetrieved from \"https://en. wikipedia. org/w/index. php? title=Artificial_intelligence&oldid=1336676724\"\n\nCategories:\n\n• Artificial intelligence\n\n• Computational fields of study\n\n• Computational neuroscience\n\n• Cybernetics\n\n• Data science\n\n• Formal sciences\n\n• Intelligence by type\n\nHidden categories:\n\n• Webarchive template wayback links\n\n• CS1 German-language sources (de)\n\n• CS1 Russian-language sources (ru)\n\n• CS1 Japanese-language sources (ja)\n\n• Articles with short description\n\n• Short description is different from Wikidata\n\n• Use dmy dates from October 2025\n\n• Wikipedia indefinitely semi-protected pages\n\n• Articles with excerpts\n\n• Pages displaying short descriptions of redirect targets via Module: Annotated link\n\n• CS1: long volume value\n\n• Pages using Sister project links with hidden wikidata\n\n• Articles with Internet Encyclopedia of Philosophy links",
        "metadata": {
          "hash": "e8c20de86221bf2a6e887de9f969f94fcd37a015149a485088903a5d0e75940a"
        },
        "sourceTrust": "medium",
        "fetchedAt": "2026-02-07T15:48:58.555Z"
      }
    },
    {
      "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
      "score": 0.8209865,
      "document": {
        "id": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
        "url": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770478974882",
        "text": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azərbaycanca\n\n• تۆرکجه\n\n• বাংলা\n\n• 閩南語 / Bân-lâm-gí\n\n• Башҡортса\n\n• Беларуская\n\n• Беларуская (тарашкевіца)\n\n• भोजपुरी\n\n• Bikol Central\n\n• Български\n\n• Boarisch\n\n• བོད་ཡིག\n\n• Bosanski\n\n• Brezhoneg\n\n• Буряад\n\n• Català\n\n• Чӑвашла\n\n• Cebuano\n\n• Čeština\n\n• Cymraeg\n\n• Dansk\n\n• الدارجة\n\n• Deutsch\n\n• Eesti\n\n• Ελληνικά\n\n• Español\n\n• Esperanto\n\n• Estremeñu\n\n• Euskara\n\n• فارسی\n\n• Fiji Hindi\n\n• Français\n\n• Furlan\n\n• Gaeilge\n\n• Gaelg\n\n• Gàidhlig\n\n• Galego\n\n• 贛語\n\n• Gĩkũyũ\n\n• गोंयची कोंकणी / Gõychi Konknni\n\n• 한국어\n\n• Hausa\n\n• Հայերեն\n\n• हिन्दी\n\n• Hrvatski\n\n• Ido\n\n• Igbo\n\n• Ilokano\n\n• Bahasa Indonesia\n\n• Interlingua\n\n• Interlingue\n\n• IsiZulu\n\n• Íslenska\n\n• Italiano\n\n• עברית\n\n• Jawa\n\n• ಕನ್ನಡ\n\n• ქართული\n\n• کٲشُر\n\n• Қазақша\n\n• Kiswahili\n\n• Kreyòl ayisyen\n\n• Kriyòl gwiyannen\n\n• Kurdî\n\n• Кыргызча\n\n• ລາວ\n\n• Latina\n\n• Latviešu\n\n• Lëtzebuergesch\n\n• Lietuvių\n\n• Ligure\n\n• Limburgs\n\n• La. lojban.\n\n• Lombard\n\n• Magyar\n\n• Madhurâ\n\n• Македонски\n\n• Malagasy\n\n• മലയാളം\n\n• Malti\n\n• मराठी\n\n• მარგალური\n\n• مصرى\n\n• Bahasa Melayu\n\n• Minangkabau\n\n• Монгол\n\n• မြန်မာဘာသာ\n\n• Nederlands\n\n• Nedersaksies\n\n• नेपाली\n\n• नेपाल भाषा\n\n• 日本語\n\n• Nordfriisk\n\n• Norsk bokmål\n\n• Norsk nynorsk\n\n• Occitan\n\n• ଓଡ଼ିଆ\n\n• Oʻzbekcha / ўзбекча\n\n• ਪੰਜਾਬੀ\n\n• پنجابی\n\n• ပအိုဝ်ႏဘာႏသာႏ\n\n• پښتو\n\n• Patois\n\n• ភាសាខ្មែរ\n\n• Picard\n\n• Piemontèis\n\n• Plattdüütsch\n\n• Polski\n\n• Português\n\n• Qaraqalpaqsha\n\n• Qırımtatarca\n\n• Reo tahiti\n\n• Ripoarisch\n\n• Română\n\n• Runa Simi\n\n• Русиньскый\n\n• Русский\n\n• Саха тыла\n\n• संस्कृतम्\n\n• Sängö\n\n• Scots\n\n• Sesotho sa Leboa\n\n• Shqip\n\n• Sicilianu\n\n• සිංහල\n\n• Simple English\n\n• سنڌي\n\n• Slovenčina\n\n• Slovenščina\n\n• کوردی\n\n• Српски / srpski\n\n• Srpskohrvatski / српскохрватски\n\n• Suomi\n\n• Svenska\n\n• Tagalog\n\n• தமிழ்\n\n• Татарча / tatarça\n\n• తెలుగు\n\n• ไทย\n\n• Тоҷикӣ\n\n• Türkçe\n\n• Türkmençe\n\n• Українська\n\n• اردو\n\n• ئۇيغۇرچە / Uyghurche\n\n• Vèneto\n\n• Tiếng Việt\n\n• Võro\n\n• Walon\n\n• 文言\n\n• Winaray\n\n• 吴语\n\n• ייִדיש\n\n• 粵語\n\n• Zazaki\n\n• Žemaitėška\n\n• 中文\n\n• Betawi\n\n• Kadazandusun\n\n• Fɔ̀ngbè\n\n• Jaku Iban\n\n• ꠍꠤꠟꠐꠤ\n\n• ⵜⴰⵎⴰⵣⵉⵖⵜ ⵜⴰⵏⴰⵡⴰⵢⵜ\n\nEdit links\n\n• Article\n\n• Talk\n\nEnglish\n\n• Read\n\n• View source\n\n• View history\n\nTools\n\nTools\n\nmove to sidebar\nhide\n\nActions\n\n• Read\n\n• View source\n\n• View history\n\nGeneral\n\n• What links here\n\n• Related changes\n\n• Upload file\n\n• Permanent link\n\n• Page information\n\n• Cite this page\n\n• Get shortened URL\n\n• Download QR code\n\nPrint/export\n\n• Download as PDF\n\n• Printable version\n\nIn other projects\n\n• Wikimedia Commons\n\n• Wikibooks\n\n• Wikiquote\n\n• Wikiversity\n\n• Wikidata item\n\nAppearance\n\nmove to sidebar\nhide\n\nFrom Wikipedia, the free encyclopedia\n\n\"AI\" redirects here. For other uses, see AI (disambiguation) and Artificial intelligence (disambiguation).\n\nPart of a series on\n\nArtificial intelligence (AI)\n\nMajor goals\n\n• Artificial general intelligence\n\n• Intelligent agent\n\n• Recursive self-improvement\n\n• Planning\n\n• Computer vision\n\n• General game playing\n\n• Knowledge representation\n\n• Natural language processing\n\n• Robotics\n\n• AI safety\n\nApproaches\n\n• Machine learning\n\n• Symbolic\n\n• Deep learning\n\n• Bayesian networks\n\n• Evolutionary algorithms\n\n• Hybrid intelligent systems\n\n• Systems integration\n\n• Open-source\n\n• AI data centers\n\nApplications\n\n• Bioinformatics\n\n• Deepfake\n\n• Earth sciences\n\n• Finance\n\n• Generative AI\n\n• Art\n\n• Audio\n\n• Music\n\n• Government\n\n• Healthcare\n\n• Mental health\n\n• Industry\n\n• Software development\n\n• Translation\n\n• Military\n\n• Physics\n\n• Projects\n\nPhilosophy\n\n• AI alignment\n\n• Artificial consciousness\n\n• The bitter lesson\n\n• Chinese room\n\n• Friendly AI\n\n• Ethics\n\n• Existential risk\n\n• Turing test\n\n• Uncanny valley\n\n• Human-AI interaction\n\nHistory\n\n• Timeline\n\n• Progress\n\n• AI winter\n\n• AI boom\n\n• AI bubble\n\nControversies\n\n• Deepfake pornography\n\n• Taylor Swift deepfake pornography controversy\n\n• Grok deepfake pornography controversy\n\n• Google Gemini image generation controversy\n\n• Pause Giant AI Experiments\n\n• Removal of Sam Altman from OpenAI\n\n• Statement on AI Risk\n\n• Tay (chatbot)\n\n• Théâtre D'opéra Spatial\n\n• Voiceverse NFT plagiarism scandal\n\nGlossary\n\n• Glossary\n\n• v\n\n• t\n\n• e\n\nArtificial intelligence (AI) is the capability of computational systems to perform tasks typically associated with human intelligence, such as learning, reasoning, problem-solving, perception, and decision-making. It is a field of research in computer science that develops and studies methods and software that enable machines to perceive their environment and use learning and intelligence to take actions that maximize their chances of achieving defined goals.[1]\n\nHigh-profile applications of AI include advanced web search engines (e. g., Google Search); recommendation systems (used by YouTube, Amazon, and Netflix); virtual assistants (e. g., Google Assistant, Siri, and Alexa); autonomous vehicles (e. g., Waymo); generative and creative tools (e. g., language models and AI art); and superhuman play and analysis in strategy games (e. g., chess and Go). However, many AI applications are not perceived as AI: \"A lot of cutting edge AI has filtered into general applications, often without being called AI because once something becomes useful enough and common enough it's not labeled AI anymore.\"[2][3]\n\nVarious subfields of AI research are centered around particular goals and the use of particular tools. The traditional goals of AI research include learning, reasoning, knowledge representation, planning, natural language processing, perception, and support for robotics.[a] To reach these goals, AI researchers have adapted and integrated a wide range of techniques, including search and mathematical optimization, formal logic, artificial neural networks, and methods based on statistics, operations research, and economics.[b] AI also draws upon psychology, linguistics, philosophy, neuroscience, and other fields.[4] Some companies, such as OpenAI, Google DeepMind and Meta,[5] aim to create artificial general intelligence (AGI) - AI that can complete virtually any cognitive task at least as well as a human.\n\nArtificial intelligence was founded as an academic discipline in 1956,[6] and the field went through multiple cycles of optimism throughout its history,[7][8] followed by periods of disappointment and loss of funding, known as AI winters.[9][10] Funding and interest vastly increased after 2012 when graphics processing units started being used to accelerate neural networks, and deep learning outperformed previous AI techniques.[11] This growth accelerated further after 2017 with the transformer architecture.[12] In the 2020s, an ongoing period of rapid progress in advanced generative AI became known as the AI boom. Generative AI's ability to create and modify content has led to several unintended consequences and harms. Ethical concerns have been raised about AI's long-term effects and potential existential risks, prompting discussions about regulatory policies to ensure the safety and benefits of the technology.\n\n## Goals\n\nThe general problem of simulating (or creating) intelligence has been broken into subproblems. These consist of particular traits or capabilities that researchers expect an intelligent system to display. The traits described below have received the most attention and cover the scope of AI research.[a]\n\n### Reasoning and problem-solving\n\nEarly researchers developed algorithms that imitated step-by-step reasoning that humans use when they solve puzzles or make logical deductions.[13] By the late 1980s and 1990s, methods were developed for dealing with uncertain or incomplete information, employing concepts from probability and economics.[14]\n\nMany of these algorithms are insufficient for solving large reasoning problems because they experience a \"combinatorial explosion\": They become exponentially slower as the problems grow.[15] Even humans rarely use the step-by-step deduction that early AI research could model. They solve most of their problems using fast, intuitive judgments.[16] Accurate and efficient reasoning is an unsolved problem.\n\n### Knowledge representation\n\nAn ontology represents knowledge as a set of concepts within a domain and the relationships between those concepts.\n\nKnowledge representation and knowledge engineering[17] allow AI programs to answer questions intelligently and make deductions about real-world facts. Formal knowledge representations are used in content-based indexing and retrieval,[18] scene interpretation,[19] clinical decision support,[20] knowledge discovery (mining \"interesting\" and actionable inferences from large databases),[21] and other areas.[22]\n\nA knowledge base is a body of knowledge represented in a form that can be used by a program. An ontology is the set of objects, relations, concepts, and properties used by a particular domain of knowledge.[23] Knowledge bases need to represent things such as objects, properties, categories, and relations between objects;[24] situations, events, states, and time;[25] causes and effects;[26] knowledge about knowledge (what we know about what other people know);[27] default reasoning (things that humans assume are true until they are told differently and will remain true even when other facts are changing);[28] and many other aspects and domains of knowledge.\n\nAmong the most difficult problems in knowledge representation are the breadth of commonsense knowledge (the set of atomic facts that the average person knows is enormous);[29] and the sub-symbolic form of most commonsense knowledge (much of what people know is not represented as \"facts\" or \"statements\" that they could express verbally).[16] There is also the difficulty of knowledge acquisition, the problem of obtaining knowledge for AI applications.[c]\n\n### Planning and decision-making\n\nAn \"agent\" is anything that perceives and takes actions in the world. A rational agent has goals or preferences and takes actions to make them happen.[d][32] In automated planning, the agent has a specific goal.[33] In automated decision-making, the agent has preferences-there are some situations it would prefer to be in, and some situations it is trying to avoid. The decision-making agent assigns a number to each situation (called the \"utility\") that measures how much the agent prefers it. For each possible action, it can calculate the \"expected utility\": the utility of all possible outcomes of the action, weighted by the probability that the outcome will occur. It can then choose the action with the maximum expected utility.[34]\n\nIn classical planning, the agent knows exactly what the effect of any action will be.[35] In most real-world problems, however, the agent may not be certain about the situation they are in (it is \"unknown\" or \"unobservable\") and it may not know for certain what will happen after each possible action (it is not \"deterministic\"). It must choose an action by making a probabilistic guess and then reassess the situation to see if the action worked.[36]\n\nIn some problems, the agent's preferences may be uncertain, especially if there are other agents or humans involved. These can be learned (e. g., with inverse reinforcement learning), or the agent can seek information to improve its preferences.[37] Information value theory can be used to weigh the value of exploratory or experimental actions.[38] The space of possible future actions and situations is typically intractably large, so the agents must take actions and evaluate situations while being uncertain of what the outcome will be.\n\nA Markov decision process has a transition model that describes the probability that a particular action will change the state in a particular way and a reward function that supplies the utility of each state and the cost of each action. A policy associates a decision with each possible state. The policy could be calculated (e. g., by iteration), be heuristic, or it can be learned.[39]\n\nGame theory describes the rational behavior of multiple interacting agents and is used in AI programs that make decisions that involve other agents.[40]\n\n### Learning\n\nMachine learning is the study of programs that can improve their performance on a given task automatically.[41] It has been a part of AI from the beginning.[e]\n\nIn supervised learning, the training data is labelled with the expected answers, while in unsupervised learning, the model identifies patterns or structures in unlabelled data.\n\nThere are several kinds of machine learning. Unsupervised learning analyzes a stream of data and finds patterns and makes predictions without any other guidance.[44] Supervised learning requires labeling the training data with the expected answers, and comes in two main varieties: classification (where the program must learn to predict what category the input belongs in) and regression (where the program must deduce a numeric function based on numeric input).[45]\n\nIn reinforcement learning, the agent is rewarded for good responses and punished for bad ones. The agent learns to choose responses that are classified as \"good\".[46] Transfer learning is when the knowledge gained from one problem is applied to a new problem.[47] Deep learning is a type of machine learning that runs inputs through biologically inspired artificial neural networks for all of these types of learning.[48]\n\nComputational learning theory can assess learners by computational complexity, by sample complexity (how much data is required), or by other notions of optimization.[49]\n\n### Natural language processing\n\nNatural language processing (NLP) allows programs to read, write and communicate in human languages.[50] Specific problems include speech recognition, speech synthesis, machine translation, information extraction, information retrieval and question answering.[51]\n\nEarly work, based on Noam Chomsky's generative grammar and semantic networks, had difficulty with word-sense disambiguation[f] unless restricted to small domains called \"micro-worlds\" (due to the common sense knowledge problem[29]). Margaret Masterman believed that it was meaning and not grammar that was the key to understanding languages, and that thesauri and not dictionaries should be the basis of computational language structure.\n\nModern deep learning techniques for NLP include word embedding (representing words, typically as vectors encoding their meaning),[52] transformers (a deep learning architecture using an attention mechanism),[53] and others.[54] In 2019, generative pre-trained transformer (or \"GPT\") language models began to generate coherent text,[55][56] and by 2023, these models were able to get human-level scores on the bar exam, SAT test, GRE test, and many other real-world applications.[57]\n\n### Perception\n\nMachine perception is the ability to use input from sensors (such as cameras, microphones, wireless signals, active lidar, sonar, radar, and tactile sensors) to deduce aspects of the world. Computer vision is the ability to analyze visual input.[58]\n\nThe field includes speech recognition,[59] image classification,[60] facial recognition, object recognition,[61] object tracking,[62] and robotic perception.[63]\n\n### Social intelligence\n\nKismet, a robot head which was made in the 1990s; it is a machine that can recognize and simulate emotions.[64]\n\nAffective computing is a field that comprises systems that recognize, interpret, process, or simulate human feeling, emotion, and mood.[65] For example, some virtual assistants are programmed to speak conversationally or even to banter humorously; it makes them appear more sensitive to the emotional dynamics of human interaction, or to otherwise facilitate human-computer interaction.\n\nHowever, this tends to give naïve users an unrealistic conception of the intelligence of existing computer agents.[66] Moderate successes related to affective computing include textual sentiment analysis and, more recently, multimodal sentiment analysis, wherein AI classifies the effects displayed by a videotaped subject.[67]\n\n### General intelligence\n\nA machine with artificial general intelligence would be able to solve a wide variety of problems with breadth and versatility similar to human intelligence.[68]\n\n## Techniques\n\nAI research uses a wide variety of techniques to accomplish the goals above.[b]\n\n### Search and optimization\n\nAI can solve many problems by intelligently searching through many possible solutions.[69] There are two very different kinds of search used in AI: state space search and local search.\n\n#### State space search\n\nState space search searches through a tree of possible states to try to find a goal state.[70] For example, planning algorithms search through trees of goals and subgoals, attempting to find a path to a target goal, a process called means-ends analysis.[71]\n\nSimple exhaustive searches[72] are rarely sufficient for most real-world problems: the search space (the number of places to search) quickly grows to astronomical numbers. The result is a search that is too slow or never completes.[15] \"Heuristics\" or \"rules of thumb\" can help prioritize choices that are more likely to reach a goal.[73]\n\nAdversarial search is used for game-playing programs, such as chess or Go. It searches through a tree of possible moves and countermoves, looking for a winning position.[74]\n\n#### Local search\n\nIllustration of gradient descent for 3 different starting points; two parameters (represented by the plan coordinates) are adjusted in order to minimize the loss function (the height)\n\nLocal search uses mathematical optimization to find a solution to a problem. It begins with some form of guess and refines it incrementally.[75]\n\nGradient descent is a type of local search that optimizes a set of numerical parameters by incrementally adjusting them to minimize a loss function. Variants of gradient descent are commonly used to train neural networks,[76] through the backpropagation algorithm.\n\nAnother type of local search is evolutionary computation, which aims to iteratively improve a set of candidate solutions by \"mutating\" and \"recombining\" them, selecting only the fittest to survive each generation.[77]\n\nDistributed search processes can coordinate via swarm intelligence algorithms. Two popular swarm algorithms used in search are particle swarm optimization (inspired by bird flocking) and ant colony optimization (inspired by ant trails).[78]\n\n### Logic\n\nFormal logic is used for reasoning and knowledge representation.[79]\nFormal logic comes in two main forms: propositional logic (which operates on statements that are true or false and uses logical connectives such as \"and\", \"or\", \"not\" and \"implies\")[80] and predicate logic (which also operates on objects, predicates and relations and uses quantifiers such as \"Every X is a Y\" and \"There are some Xs that are Ys\").[81]\n\nDeductive reasoning in logic is the process of proving a new statement (conclusion) from other statements that are given and assumed to be true (the premises).[82] Proofs can be structured as proof trees, in which nodes are labelled by sentences, and children nodes are connected to parent nodes by inference rules.\n\nGiven a problem and a set of premises, problem-solving reduces to searching for a proof tree whose root node is labelled by a solution of the problem and whose leaf nodes are labelled by premises or axioms. In the case of Horn clauses, problem-solving search can be performed by reasoning forwards from the premises or backwards from the problem.[83] In the more general case of the clausal form of first-order logic, resolution is a single, axiom-free rule of inference, in which a problem is solved by proving a contradiction from premises that include the negation of the problem to be solved.[84]\n\nInference in both Horn clause logic and first-order logic is undecidable, and therefore intractable. However, backward reasoning with Horn clauses, which underpins computation in the logic programming language Prolog, is Turing complete. Moreover, its efficiency is competitive with computation in other symbolic programming languages.[85]\n\nFuzzy logic assigns a \"degree of truth\" between 0 and 1. It can therefore handle propositions that are vague and partially true.[86]\n\nNon-monotonic logics, including logic programming with negation as failure, are designed to handle default reasoning.[28] Other specialized versions of logic have been developed to describe many complex domains.\n\n### Probabilistic methods for uncertain reasoning\n\nA simple Bayesian network, with the associated conditional probability tables\n\nMany problems in AI (including reasoning, planning, learning, perception, and robotics) require the agent to operate with incomplete or uncertain information. AI researchers have devised a number of tools to solve these problems using methods from probability theory and economics.[87] Precise mathematical tools have been developed that analyze how an agent can make choices and plan, using decision theory, decision analysis,[88] and information value theory.[89] These tools include models such as Markov decision processes,[90] dynamic decision networks,[91] game theory and mechanism design.[92]\n\nBayesian networks[93] are a tool that can be used for reasoning (using the Bayesian inference algorithm),[g][95] learning (using the expectation-maximization algorithm),[h][97] planning (using decision networks)[98] and perception (using dynamic Bayesian networks).[91]\n\nProbabilistic algorithms can also be used for filtering, prediction, smoothing, and finding explanations for streams of data, thus helping perception systems analyze processes that occur over time (e. g., hidden Markov models or Kalman filters).[91]\n\nExpectation-maximization clustering of Old Faithful eruption data starts from a random guess but then successfully converges on an accurate clustering of the two physically distinct modes of eruption.\n\n### Classifiers and statistical learning methods\n\nThe simplest AI applications can be divided into two types: classifiers (e. g., \"if shiny then diamond\"), on one hand, and controllers (e. g., \"if diamond then pick up\"), on the other hand. Classifiers[99] are functions that use pattern matching to determine the closest match. They can be fine-tuned based on chosen examples using supervised learning. Each pattern (also called an \"observation\") is labeled with a certain predefined class. All the observations combined with their class labels are known as a data set. When a new observation is received, that observation is classified based on previous experience.[45]\n\nThere are many kinds of classifiers in use.[100] The decision tree is the simplest and most widely used symbolic machine learning algorithm.[101] K-nearest neighbor algorithm was the most widely used analogical AI until the mid-1990s, and Kernel methods such as the support vector machine (SVM) displaced k-nearest neighbor in the 1990s.[102]\nThe naive Bayes classifier is reportedly the \"most widely used learner\"[103] at Google, due in part to its scalability.[104]\nNeural networks are also used as classifiers.[105]\n\n### Artificial neural networks\n\nA neural network is an interconnected group of nodes, akin to the vast network of neurons in the human brain.\n\nAn artificial neural network is based on a collection of nodes also known as artificial neurons, which loosely model the neurons in a biological brain. It is trained to recognise patterns; once trained, it can recognise those patterns in fresh data. There is an input, at least one hidden layer of nodes and an output. Each node applies a function and once the weight crosses its specified threshold, the data is transmitted to the next layer. A network is typically called a deep neural network if it has at least 2 hidden layers.[105]\n\nLearning algorithms for neural networks use local search to choose the weights that will get the right output for each input during training. The most common training technique is the backpropagation algorithm.[106] Neural networks learn to model complex relationships between inputs and outputs and find patterns in data. In theory, a neural network can learn any function.[107]\n\nIn feedforward neural networks the signal passes in only one direction.[108] The term perceptron typically refers to a single-layer neural network.[109] In contrast, deep learning uses many layers.[110] Recurrent neural networks (RNNs) feed the output signal back into the input, which allows short-term memories of previous input events. Long short-term memory networks (LSTMs) are recurrent neural networks that better preserve longterm dependencies and are less sensitive to the vanishing gradient problem.[111] Convolutional neural networks (CNNs) use layers of kernels to more efficiently process local patterns. This local processing is especially important in image processing, where the early CNN layers typically identify simple local patterns such as edges and curves, with subsequent layers detecting more complex patterns like textures, and eventually whole objects.[112]\n\n### Deep learning\n\nDeep learning is a subset of machine learning, which is itself a subset of artificial intelligence.[113]\n\nDeep learning uses several layers of neurons between the network's inputs and outputs.[110] The multiple layers can progressively extract higher-level features from the raw input. For example, in image processing, lower layers may identify edges, while higher layers may identify the concepts relevant to a human such as digits, letters, or faces.[114]\n\nDeep learning has profoundly improved the performance of programs in many important subfields of artificial intelligence, including computer vision, speech recognition, natural language processing, image classification,[115] and others. The reason that deep learning performs so well in so many applications is not known as of 2021.[116] The sudden success of deep learning in 2012-2015 did not occur because of some new discovery or theoretical breakthrough (deep neural networks and backpropagation had been described by many people, as far back as the 1950s)[i] but because of two factors: the incredible increase in computer power (including the hundred-fold increase in speed by switching to GPUs) and the availability of vast amounts of training data, especially the giant curated datasets used for benchmark testing, such as ImageNet.[j]\n\n### GPT\n\nGenerative pre-trained transformers (GPT) are large language models (LLMs) that generate text based on the semantic relationships between words in sentences. Text-based GPT models are pre-trained on a large corpus of text that can be from the Internet. The pretraining consists of predicting the next token (a token being usually a word, subword, or punctuation). Throughout this pretraining, GPT models accumulate knowledge about the world and can then generate human-like text by repeatedly predicting the next token. Typically, a subsequent training phase makes the model more truthful, useful, and harmless, usually with a technique called reinforcement learning from human feedback (RLHF). Current GPT models are prone to generating falsehoods called \"hallucinations\". These can be reduced with RLHF and quality data, but the problem has been getting worse for reasoning systems.[124] Such systems are used in chatbots, which allow people to ask a question or request a task in simple text.[125][126]\n\nCurrent models and services include ChatGPT, Claude, Gemini, Copilot, and Meta AI.[127] Multimodal GPT models can process different types of data (modalities) such as images, videos, sound, and text.[128]\n\n### Hardware and software\n\nMain articles: Programming languages for artificial intelligence and Hardware for artificial intelligence\n\nRaspberry Pi AI Kit\n\nIn the late 2010s, graphics processing units (GPUs) that were increasingly designed with AI-specific enhancements and used with specialized TensorFlow software had replaced previously used central processing unit (CPUs) as the dominant means for large-scale (commercial and academic) machine learning models' training.[129] Specialized programming languages such as Prolog were used in early AI research,[130] but general-purpose programming languages like Python have become predominant.[131]\n\nThe transistor density in integrated circuits has been observed to roughly double every 18 months-a trend known as Moore's law, named after the Intel co-founder Gordon Moore, who first identified it. Improvements in GPUs have been even faster,[132] a trend sometimes called Huang's law,[133] named after Nvidia co-founder and CEO Jensen Huang.\n\n## Applications\n\nMain article: Applications of artificial intelligence\n\nAI and machine learning technology is used in most of the essential applications of the 2020s, including:\n\n• search engines (such as Google Search)\n\n• targeting online advertisements\n\n• recommendation systems (offered by Netflix, YouTube or Amazon) driving internet traffic\n\n• targeted advertising (AdSense, Facebook)\n\n• virtual assistants (such as Siri or Alexa)\n\n• autonomous vehicles (including drones, ADAS and self-driving cars)\n\n• automatic language translation (Microsoft Translator, Google Translate)\n\n• facial recognition (Apple's FaceID or Microsoft's DeepFace and Google's FaceNet)\n\n• image labeling (used by Facebook, Apple's Photos and TikTok).\n\nThe deployment of AI may be overseen by a chief automation officer (CAO).\n\n### Health and medicine\n\nMain article: Artificial intelligence in healthcare\n\nIt has been suggested that AI can overcome discrepancies in funding allocated to different fields of research.[134]\n\nAlphaFold 2 (2021) demonstrated the ability to approximate, in hours rather than months, the 3D structure of a protein.[135] In 2023, it was reported that AI-guided drug discovery helped find a class of antibiotics capable of killing two different types of drug-resistant bacteria.[136] In 2024, researchers used machine learning to accelerate the search for Parkinson's disease drug treatments. Their aim was to identify compounds that block the clumping, or aggregation, of alpha-synuclein (the protein that characterises Parkinson's disease). They were able to speed up the initial screening process ten-fold and reduce the cost by a thousand-fold.[137][138]\n\n### Gaming\n\nMain article: Artificial intelligence in video games\n\nGame playing programs have been used since the 1950s to demonstrate and test AI's most advanced techniques.[139] Deep Blue became the first computer chess-playing system to beat a reigning world chess champion, Garry Kasparov, on 11 May 1997.[140] In 2011, in a Jeopardy! quiz show exhibition match, IBM's question answering system, Watson, defeated the two greatest Jeopardy! champions, Brad Rutter and Ken Jennings, by a significant margin.[141] In March 2016, AlphaGo won 4 out of 5 games of Go in a match with Go champion Lee Sedol, becoming the first computer Go-playing system to beat a professional Go player without handicaps. Then, in 2017, it defeated Ke Jie, who was the best Go player in the world.[142] Other programs handle imperfect-information games, such as the poker-playing program Pluribus.[143] DeepMind developed increasingly generalistic reinforcement learning models, such as with MuZero, which could be trained to play chess, Go, or Atari games.[144] In 2019, DeepMind's AlphaStar achieved grandmaster level in StarCraft II, a particularly challenging real-time strategy game that involves incomplete knowledge of what happens on the map.[145] In 2021, an AI agent competed in a PlayStation Gran Turismo competition, winning against four of the world's best Gran Turismo drivers using deep reinforcement learning.[146] In 2024, Google DeepMind introduced SIMA, a type of AI capable of autonomously playing nine previously unseen open-world video games by observing screen output, as well as executing short, specific tasks in response to natural language instructions.[147]\n\n### Mathematics\n\nLarge language models, such as GPT-4, Gemini, Claude, Llama or Mistral, are increasingly used in mathematics. These probabilistic models are versatile, but can also produce wrong answers in the form of hallucinations. They sometimes need a large database of mathematical problems to learn from, but also methods such as supervised fine-tuning[148] or trained classifiers with human-annotated data to improve answers for new problems and learn from corrections.[149] A February 2024 study showed that the performance of some language models for reasoning capabilities in solving math problems not included in their training data was low, even for problems with only minor deviations from trained data.[150] One technique to improve their performance involves training the models to produce correct reasoning steps, rather than just the correct result.[151] The Alibaba Group developed a version of its Qwen models called Qwen2-Math, that achieved state-of-the-art performance on several mathematical benchmarks, including 84% accuracy on the MATH dataset of competition mathematics problems.[152] In January 2025, Microsoft proposed the technique rStar-Math that leverages Monte Carlo tree search and step-by-step reasoning, enabling a relatively small language model like Qwen-7B to solve 53% of the AIME 2024 and 90% of the MATH benchmark problems.[153]\n\nAlternatively, dedicated models for mathematical problem solving with higher precision for the outcome including proof of theorems have been developed such as AlphaTensor, AlphaGeometry, AlphaProof and AlphaEvolve[154] all from Google DeepMind,[155] Llemma from EleutherAI[156] or Julius.[157]\n\nWhen natural language is used to describe mathematical problems, converters can transform such prompts into a formal language such as Lean to define mathematical tasks. The experimental model Gemini Deep Think accepts natural language prompts directly and achieved gold medal results in the International Math Olympiad of 2025.[158]\n\nSome models have been developed to solve challenging problems and reach good results in benchmark tests, others to serve as educational tools in mathematics.[159]\n\nTopological deep learning integrates various topological approaches.\n\n### Finance\n\nFinance is one of the fastest growing sectors where applied AI tools are being deployed: from retail online banking to investment advice and insurance, where automated \"robot advisers\" have been in use for some years.[160]\n\nAccording to Nicolas Firzli, director of the World Pensions & Investments Forum, it may be too early to see the emergence of highly innovative AI-informed financial products and services. He argues that \"the deployment of AI tools will simply further automatise things: destroying tens of thousands of jobs in banking, financial planning, and pension advice in the process, but I'm not sure it will unleash a new wave of [e. g., sophisticated] pension innovation.\"[161]\n\n### Military\n\nMain article: Military applications of artificial intelligence\n\nVarious countries are deploying AI military applications.[162] The main applications enhance command and control, communications, sensors, integration and interoperability.[163] Research is targeting intelligence collection and analysis, logistics, cyber operations, information operations, and semiautonomous and autonomous vehicles.[162] AI technologies enable coordination of sensors and effectors, threat detection and identification, marking of enemy positions, target acquisition, coordination and deconfliction of distributed Joint Fires between networked combat vehicles, both human-operated and autonomous.[163]\n\nAI has been used in military operations in Iraq, Syria, Israel and Ukraine.[162][164][165][166]\n\n### Generative AI\n\nVincent van Gogh in watercolour created by generative AI software\n\nThese paragraphs are an excerpt from Generative artificial intelligence.[edit]\n\nGenerative artificial intelligence, also known as generative AI or GenAI, is a subfield of artificial intelligence that uses generative models to generate text, images, videos, audio, software code or other forms of data.[167]\nThese models learn the underlying patterns and structures of their training data and use them to generate new data[168]\nin response to input, which often takes the form of natural language prompts.[169][170]\nThe generated material is often called AIGC (AI Generated Content).[citation needed]\n\nThe prevalence of generative AI tools has increased significantly since the AI boom in the 2020s. This boom was made possible by improvements in deep neural networks, particularly large language models (LLMs), which are based on the transformer architecture. Generative AI applications include chatbots such as ChatGPT, Claude, Copilot, DeepSeek, Google Gemini and Grok; text-to-image models such as Stable Diffusion, Midjourney, and DALL-E; and text-to-video models such as Veo, LTX and Sora.[171][172][173]\n\nCompanies in a variety of sectors have used generative AI, including those in software development, healthcare,[174] finance,[175] entertainment,[176] customer service,[177] sales and marketing,[178] art, writing,[179] and product design.[180]\n\n### Agents\n\nMain article: Agentic AI\n\nAI agents are software entities designed to perceive their environment, make decisions, and take actions autonomously to achieve specific goals. These agents can interact with users, their environment, or other agents. AI agents are used in various applications, including virtual assistants, chatbots, autonomous vehicles, game-playing systems, and industrial robotics. AI agents operate within the constraints of their programming, available computational resources, and hardware limitations. This means they are restricted to performing tasks within their defined scope and have finite memory and processing capabilities. In real-world applications, AI agents often face time constraints for decision-making and action execution. Many AI agents incorporate learning algorithms, enabling them to improve their performance over time through experience or training. Using machine learning, AI agents can adapt to new situations and optimise their behaviour for their designated tasks.[181][182][183]\n\n### Web search\n\nMicrosoft introduced Copilot Search in February 2023 under the name Bing Chat, as a built-in feature for Microsoft Edge and Bing mobile app. Copilot Search provides AI-generated summaries[184] and step-by-step reasoning based of information from web publishers, ranked in Bing Search.[185]\nFor safety, Copilot uses AI-based classifiers and filters to reduce potentially harmful content.[186]\n\nGoogle officially pushed its AI Search at its Google I/O event on 20 May 2025.[187] It keeps people looking at Google instead of clicking on a search result. AI Overviews uses Gemini 2.5 to provide contextual answers to user queries based on web content.[188]\n\n### Sexuality\n\nApplications of AI in this domain include AI-enabled menstruation and fertility trackers that analyze user data to offer predictions,[189] AI-integrated sex toys (e. g., teledildonics),[190] AI-generated sexual education content,[191] and AI agents that simulate sexual and romantic partners (e. g., Replika).[192] AI is also used for the production of non-consensual deepfake pornography, raising significant ethical and legal concerns.[193]\n\nAI technologies have also been used to attempt to identify online gender-based violence and online sexual grooming of minors.[194][195]\n\n### Other industry-specific tasks\n\nThere are also thousands of successful AI applications used to solve specific problems for specific industries or institutions. In a 2017 survey, one in five companies reported having incorporated \"AI\" in some offerings or processes.[196] A few examples are energy storage, medical diagnosis, military logistics, applications that predict the result of judicial decisions, foreign policy, or supply chain management.\n\nAI applications for evacuation and disaster management are growing. AI has been used to investigate patterns in large-scale and small-scale evacuations using historical data from GPS, videos or social media. Furthermore, AI can provide real-time information on the evacuation conditions.[197][198][199]\n\nIn agriculture, AI has helped farmers to increase yield and identify areas that need irrigation, fertilization, pesticide treatments. Agronomists use AI to conduct research and development. AI has been used to predict the ripening time for crops such as tomatoes, monitor soil moisture, operate agricultural robots, conduct predictive analytics, classify livestock pig call emotions, automate greenhouses, detect diseases and pests, and save water.\n\nArtificial intelligence is used in astronomy to analyze increasing amounts of available data and applications, mainly for \"classification, regression, clustering, forecasting, generation, discovery, and the development of new scientific insights.\" For example, it is used for discovering exoplanets, forecasting solar activity, and distinguishing between signals and instrumental effects in gravitational wave astronomy. Additionally, it could be used for activities in space, such as space exploration, including the analysis of data from space missions, real-time science decisions of spacecraft, space debris avoidance, and more autonomous operation.\n\nDuring the 2024 Indian elections, US$50 million was spent on authorized AI-generated content, notably by creating deepfakes of allied (including sometimes deceased) politicians to better engage with voters, and by translating speeches to various local languages.[200]\n\n## Ethics\n\nMain article: Ethics of artificial intelligence\n\nStreet art in Tel Aviv[201][202]\n\nAI has potential benefits and potential risks.[203] AI may be able to advance science and find solutions for serious problems: Demis Hassabis of DeepMind hopes to \"solve intelligence, and then use that to solve everything else\".[204] However, as the use of AI has become widespread, several unintended consequences and risks have been identified.[205][206] In-production systems can sometimes not factor ethics and bias into their AI training processes, especially when the AI algorithms are inherently unexplainable in deep learning.[207]\n\n### Risks and harm\n\n#### Privacy and copyright\n\nFurther information: Information privacy and Artificial intelligence and copyright\n\nMachine learning algorithms require large amounts of data. The techniques used to acquire this data have raised concerns about privacy, surveillance and copyright.\n\nAI-powered devices and services, such as virtual assistants and IoT products, continuously collect personal information, raising concerns about intrusive data gathering and unauthorized access by third parties. The loss of privacy is further exacerbated by AI's ability to process and combine vast amounts of data, potentially leading to a surveillance society where individual activities are constantly monitored and analyzed without adequate safeguards or transparency.\n\nSensitive user data collected may include online activity records, geolocation data, video, or audio.[208] For example, in order to build speech recognition algorithms, Amazon has recorded millions of private conversations and allowed temporary workers to listen to and transcribe some of them.[209] Opinions about this widespread surveillance range from those who see it as a necessary evil to those for whom it is clearly unethical and a violation of the right to privacy.[210]\n\nAI developers argue that this is the only way to deliver valuable applications and have developed several techniques that attempt to preserve privacy while still obtaining the data, such as data aggregation, de-identification and differential privacy.[211] Since 2016, some privacy experts, such as Cynthia Dwork, have begun to view privacy in terms of fairness. Brian Christian wrote that experts have pivoted \"from the question of 'what they know' to the question of 'what they're doing with it'.\"[212]\n\nGenerative AI is often trained on unlicensed copyrighted works, including in domains such as images or computer code; the output is then used under the rationale of \"fair use\". Experts disagree about how well and under what circumstances this rationale will hold up in courts of law; relevant factors may include \"the purpose and character of the use of the copyrighted work\" and \"the effect upon the potential market for the copyrighted work\".[213][214] Website owners can indicate that they do not want their content scraped via a \"robots. txt\" file.[215] However, some companies will scrape content regardless[216][217] because the robots. txt file has no real authority. In 2023, leading authors (including John Grisham and Jonathan Franzen) sued AI companies for using their work to train generative AI.[218][219] Another discussed approach is to envision a separate sui generis system of protection for creations generated by AI to ensure fair attribution and compensation for human authors.[220]\n\n#### Dominance by tech giants\n\nThe commercial AI scene is dominated by Big Tech companies such as Alphabet Inc., Amazon, Apple Inc., Meta Platforms, and Microsoft.[221][222][223] Some of these players already own the vast majority of existing cloud infrastructure and computing power from data centers, allowing them to entrench further in the marketplace.[224][225]\n\n#### Power needs and environmental impacts\n\nSee also: Environmental impacts of artificial intelligence\n\nFueled by growth in artificial intelligence, data centers' demand for power increased in the 2020s.[226]\n\nIn January 2024, the International Energy Agency (IEA) released Electricity 2024, Analysis and Forecast to 2026, forecasting electric power use.[227] This is the first IEA report to make projections for data centers and power consumption for artificial intelligence and cryptocurrency. The report states that power demand for these uses might double by 2026, with additional electric power usage equal to electricity used by the whole Japanese nation.[228]\n\nProdigious power consumption by AI is responsible for the growth of fossil fuel use, and might delay closings of obsolete, carbon-emitting coal energy facilities. There is a feverish rise in the construction of data centers throughout the US, making large technology firms (e. g., Microsoft, Meta, Google, Amazon) into voracious consumers of electric power. Projected electric consumption is so immense that there is concern that it will be fulfilled no matter the source. A ChatGPT search involves the use of 10 times the electrical energy as a Google search. The large firms are in haste to find power sources - from nuclear energy to geothermal to fusion. The tech firms argue that - in the long view - AI will be eventually kinder to the environment, but they need the energy now. AI makes the power grid more efficient and \"intelligent\", will assist in the growth of nuclear power, and track overall carbon emissions, according to technology firms.[229]\n\nA 2024 Goldman Sachs Research Paper, AI Data Centers and the Coming US Power Demand Surge, found \"US power demand (is) likely to experience growth not seen in a generation....\" and forecasts that, by 2030, US data centers will consume 8% of US power, as opposed to 3% in 2022, presaging growth for the electrical power generation industry by a variety of means.[230] Data centers' need for more and more electrical power is such that they might max out the electrical grid. The Big Tech companies counter that AI can be used to maximize the utilization of the grid by all.[231]\n\nIn 2024, the Wall Street Journal reported that big AI companies have begun negotiations with the US nuclear power providers to provide electricity to the data centers. In March 2024 Amazon purchased a Pennsylvania nuclear-powered data center for US$650 million.[232] Nvidia CEO Jensen Huang said nuclear power is a good option for the data centers.[233]\n\nIn September 2024, Microsoft announced an agreement with Constellation Energy to re-open the Three Mile Island nuclear power plant to provide Microsoft with 100% of all electric power produced by the plant for 20 years. Reopening the plant, which suffered a partial nuclear meltdown of its Unit 2 reactor in 1979, will require Constellation to get through strict regulatory processes which will include extensive safety scrutiny from the US Nuclear Regulatory Commission. If approved (this will be the first ever US re-commissioning of a nuclear plant), over 835 megawatts of power - enough for 800,000 homes - of energy will be produced. The cost for re-opening and upgrading is estimated at US$1.6 billion and is dependent on tax breaks for nuclear power contained in the 2022 US Inflation Reduction Act.[234] The US government and the state of Michigan are investing almost US$2 billion to reopen the Palisades Nuclear reactor on Lake Michigan. Closed since 2022, the plant is planned to be reopened in October 2025. The Three Mile Island facility will be renamed the Crane Clean Energy Center after Chris Crane, a nuclear proponent and former CEO of Exelon who was responsible for Exelon's spinoff of Constellation.[235]\n\nAfter the last approval in September 2023, Taiwan suspended the approval of data centers north of Taoyuan with a capacity of more than 5 MW in 2024, due to power supply shortages.[236] Taiwan aims to phase out nuclear power by 2025.[236] On the other hand, Singapore imposed a ban on the opening of data centers in 2019 due to electric power, but in 2022, lifted this ban.[236]\n\nAlthough most nuclear plants in Japan have been shut down after the 2011 Fukushima nuclear accident, according to an October 2024 Bloomberg article in Japanese, cloud gaming services company Ubitus, in which Nvidia has a stake, is looking for land in Japan near a nuclear power plant for a new data center for generative AI.[237] Ubitus CEO Wesley Kuo said nuclear power plants are the most efficient, cheap and stable power for AI.[237]\n\nOn 1 November 2024, the Federal Energy Regulatory Commission (FERC) rejected an application submitted by Talen Energy for approval to supply some electricity from the nuclear power station Susquehanna to Amazon's data center.[238]\nAccording to the Commission Chairman Willie L. Phillips, it is a burden on the electricity grid as well as a significant cost shifting concern to households and other business sectors.[238]\n\nIn 2025, a report prepared by the International Energy Agency estimated the greenhouse gas emissions from the energy consumption of AI at 180 million tons. By 2035, these emissions could rise to 300-500 million tonnes depending on what measures will be taken. This is below 1.5% of the energy sector emissions. The emissions reduction potential of AI was estimated at 5% of the energy sector emissions, but rebound effects (for example if people switch from public transport to autonomous cars) can reduce it.[239]\n\n#### Misinformation\n\nSee also: Content moderation\n\nYouTube, Facebook and others use recommender systems to guide users to more content. These AI programs were given the goal of maximizing user engagement (that is, the only goal was to keep people watching). The AI learned that users tended to choose misinformation, conspiracy theories, and extreme partisan content, and, to keep them watching, the AI recommended more of it. Users also tended to watch more content on the same subject, so the AI led people into filter bubbles where they received multiple versions of the same misinformation.[240] This convinced many users that the misinformation was true, and ultimately undermined trust in institutions, the media and the government.[241] The AI program had correctly learned to maximize its goal, but the result was harmful to society. After the U. S. election in 2016, major technology companies took some steps to mitigate the problem.[242]\n\nIn the early 2020s, generative AI began to create images, audio, and texts that are virtually indistinguishable from real photographs, recordings, or human writing,[243] while realistic AI-generated videos became feasible in the mid-2020s.[244][245][246] It is possible for bad actors to use this technology to create massive amounts of misinformation or propaganda;[247] one such potential malicious use is deepfakes for computational propaganda.[248] AI pioneer and Nobel Prize-winning computer scientist Geoffrey Hinton expressed concern about AI enabling \"authoritarian leaders to manipulate their electorates\" on a large scale, among other risks.[249] The ability to influence electorates has been proved in at least one study. This same study shows more inaccurate statements from the models when they advocate for candidates of the political right.[250]\n\nAI researchers at Microsoft, OpenAI, universities and other organisations have suggested using \"personhood credentials\" as a way to overcome online deception enabled by AI models.[251]\n\n#### Algorithmic bias and fairness\n\nMain articles: Algorithmic bias and Fairness (machine learning)\n\nMachine learning applications can be biased[k] if they learn from biased data.[253] The developers may not be aware that the bias exists.[254] Discriminatory behavior by some LLMs can be observed in their output.[255] Bias can be introduced by the way training data is selected and by the way a model is deployed.[256][253] If a biased algorithm is used to make decisions that can seriously harm people (as it can in medicine, finance, recruitment, housing or policing) then the algorithm may cause discrimination.[257] The field of fairness studies how to prevent harms from algorithmic biases.\n\nOn 28 June 2015, Google Photos's new image labeling feature mistakenly identified Jacky Alcine and a friend as \"gorillas\" because they were black. The system was trained on a dataset that contained very few images of black people,[258] a problem called \"sample size disparity\".[259] Google \"fixed\" this problem by preventing the system from labelling anything as a \"gorilla\". Eight years later, in 2023, Google Photos still could not identify a gorilla, and neither could similar products from Apple, Facebook, Microsoft and Amazon.[260]\n\nCOMPAS is a commercial program widely used by U. S. courts to assess the likelihood of a defendant becoming a recidivist. In 2016, Julia Angwin at ProPublica discovered that COMPAS exhibited racial bias, despite the fact that the program was not told the races of the defendants. Although the error rate for both whites and blacks was calibrated equal at exactly 61%, the errors for each race were different-the system consistently overestimated the chance that a black person would re-offend and would underestimate the chance that a white person would not re-offend.[261] In 2017, several researchers[l] showed that it was mathematically impossible for COMPAS to accommodate all possible measures of fairness when the base rates of re-offense were different for whites and blacks in the data.[263]\n\nA program can make biased decisions even if the data does not explicitly mention a problematic feature (such as \"race\" or \"gender\"). The feature will correlate with other features (like \"address\", \"shopping history\" or \"first name\"), and the program will make the same decisions based on these features as it would on \"race\" or \"gender\".[264] Moritz Hardt said \"the most robust fact in this research area is that fairness through blindness doesn't work.\"[265]\n\nCriticism of COMPAS highlighted that machine learning models are designed to make \"predictions\" that are only valid if we assume that the future will resemble the past. If they are trained on data that includes the results of racist decisions in the past, machine learning models must predict that racist decisions will be made in the future. If an application then uses these predictions as recommendations, some of these \"recommendations\" will likely be racist.[266] Thus, machine learning is not well suited to help make decisions in areas where there is hope that the future will be better than the past. It is descriptive rather than prescriptive.[m]\n\nBias and unfairness may go undetected because the developers are overwhelmingly white and male: among AI engineers, about 4% are black and 20% are women.[259]\n\nThere are various conflicting definitions and mathematical models of fairness. These notions depend on ethical assumptions, and are influenced by beliefs about society. One broad category is distributive fairness, which focuses on the outcomes, often identifying groups and seeking to compensate for statistical disparities. Representational fairness tries to ensure that AI systems do not reinforce negative stereotypes or render certain groups invisible. Procedural fairness focuses on the decision process rather than the outcome. The most relevant notions of fairness may depend on the context, notably the type of AI application and the stakeholders. The subjectivity in the notions of bias and fairness makes it difficult for companies to operationalize them. Having access to sensitive attributes such as race or gender is also considered by many AI ethicists to be necessary in order to compensate for biases, but it may conflict with anti-discrimination laws.[252]\n\nAt the 2022 ACM Conference on Fairness, Accountability, and Transparency a paper reported that a CLIP-based (Contrastive Language-Image Pre-training) robotic system reproduced harmful gender- and race-linked stereotypes in a simulated manipulation task. The authors recommended robot-learning methods which physically manifest such harms be \"paused, reworked, or even wound down when appropriate, until outcomes can be proven safe, effective, and just.\"[268][269][270]\n\n#### Lack of transparency\n\nSee also: Explainable AI, Algorithmic transparency, and Right to explanation\n\nMany AI systems are so complex that their designers cannot explain how they reach their decisions.[271] Particularly with deep neural networks, in which there are many non-linear relationships between inputs and outputs. But some popular explainability techniques exist.[272]\n\nIt is impossible to be certain that a program is operating correctly if no one knows how exactly it works. There have been many cases where a machine learning program passed rigorous tests, but nevertheless learned something different than what the programmers intended. For example, a system that could identify skin diseases better than medical professionals was found to actually have a strong tendency to classify images with a ruler as \"cancerous\", because pictures of malignancies typically include a ruler to show the scale.[273] Another machine learning system designed to help effectively allocate medical resources was found to classify patients with asthma as being at \"low risk\" of dying from pneumonia. Having asthma is actually a severe risk factor, but since the patients having asthma would usually get much more medical care, they were relatively unlikely to die according to the training data. The correlation between asthma and low risk of dying from pneumonia was real, but misleading.[274]\n\nPeople who have been harmed by an algorithm's decision have a right to an explanation.[275] Doctors, for example, are expected to clearly and completely explain to their colleagues the reasoning behind any decision they make. Early drafts of the European Union's General Data Protection Regulation in 2016 included an explicit statement that this right exists.[n] Industry experts noted that this is an unsolved problem with no solution in sight. Regulators argued that nevertheless the harm is real: if the problem has no solution, the tools should not be used.[276]\n\nDARPA established the XAI (\"Explainable Artificial Intelligence\") program in 2014 to try to solve these problems.[277]\n\nSeveral approaches aim to address the transparency problem. SHAP enables to visualise the contribution of each feature to the output.[278] LIME can locally approximate a model's outputs with a simpler, interpretable model.[279] Multitask learning provides a large number of outputs in addition to the target classification. These other outputs can help developers deduce what the network has learned.[280] Deconvolution, DeepDream and other generative methods can allow developers to see what different layers of a deep network for computer vision have learned, and produce output that can suggest what the network is learning.[281] For generative pre-trained transformers, Anthropic developed a technique based on dictionary learning that associates patterns of neuron activations with human-understandable concepts.[282]\n\n#### Bad actors and weaponized AI\n\nMain articles: Lethal autonomous weapon, Artificial intelligence arms race, and AI safety\n\nArtificial intelligence provides a number of tools that are useful to bad actors, such as authoritarian governments, terrorists, criminals or rogue states.\n\nA lethal autonomous weapon is a machine that locates, selects and engages human targets without human supervision.[o] Widely available AI tools can be used by bad actors to develop inexpensive autonomous weapons and, if produced at scale, they are potentially weapons of mass destruction.[284] Even when used in conventional warfare, they currently cannot reliably choose targets and could potentially kill an innocent person.[284] In 2014, 30 nations (including China) supported a ban on autonomous weapons under the United Nations' Convention on Certain Conventional Weapons, however the United States and others disagreed.[285] By 2015, over fifty countries were reported to be researching battlefield robots.[286]\n\nAI tools make it easier for authoritarian governments to efficiently control their citizens in several ways. Face and voice recognition allow widespread surveillance. Machine learning, operating this data, can classify potential enemies of the state and prevent them from hiding. Recommendation systems can precisely target propaganda and misinformation for maximum effect. Deepfakes and generative AI aid in producing misinformation. Advanced AI can make authoritarian centralized decision-making more competitive than liberal and decentralized systems such as markets. It lowers the cost and difficulty of digital warfare and advanced spyware.[287] All these technologies have been available since 2020 or earlier-AI facial recognition systems are already being used for mass surveillance in China.[288][289]\n\nThere are many other ways in which AI is expected to help bad actors, some of which can not be foreseen. For example, machine-learning AI is able to design tens of thousands of toxic molecules in a matter of hours.[290]\n\n#### Technological unemployment\n\nMain articles: Workplace impact of artificial intelligence and Technological unemployment\n\nEconomists have frequently highlighted the risks of redundancies from AI, and speculated about unemployment if there is no adequate social policy for full employment.[291]\n\nIn the past, technology has tended to increase rather than reduce total employment, but economists acknowledge that \"we're in uncharted territory\" with AI.[292] A survey of economists showed disagreement about whether the increasing use of robots and AI will cause a substantial increase in long-term unemployment, but they generally agree that it could be a net benefit if productivity gains are redistributed.[293] Risk estimates vary; for example, in the 2010s, Michael Osborne and Carl Benedikt Frey estimated 47% of U. S. jobs are at \"high risk\" of potential automation, while an OECD report classified only 9% of U. S. jobs as \"high risk\".[p][295] The methodology of speculating about future employment levels has been criticised as lacking evidential foundation, and for implying that technology, rather than social policy, creates unemployment, as opposed to redundancies.[291] In April 2023, it was reported that 70% of the jobs for Chinese video game illustrators had been eliminated by generative artificial intelligence.[296][297]\n\nUnlike previous waves of automation, many middle-class jobs may be eliminated by artificial intelligence; The Economist stated in 2015 that \"the worry that AI could do to white-collar jobs what steam power did to blue-collar ones during the Industrial Revolution\" is \"worth taking seriously\".[298] Jobs at extreme risk range from paralegals to fast food cooks, while job demand is likely to increase for care-related professions ranging from personal healthcare to the clergy.[299] In July 2025, Ford CEO Jim Farley predicted that \"artificial intelligence is going to replace literally half of all white-collar workers in the U. S.\"[300]\n\nFrom the early days of the development of artificial intelligence, there have been arguments, for example, those put forward by Joseph Weizenbaum, about whether tasks that can be done by computers actually should be done by them, given the difference between computers and humans, and between quantitative calculation and qualitative, value-based judgement.[301]\n\n#### Existential risk\n\nMain article: Existential risk from artificial intelligence\n\nRecent public debates in artificial intelligence have increasingly focused on its broader societal and ethical implications. It has been argued AI will become so powerful that humanity may irreversibly lose control of it. This could, as physicist Stephen Hawking stated, \"spell the end of the human race\".[302] This scenario has been common in science fiction, when a computer or robot suddenly develops a human-like \"self-awareness\" (or \"sentience\" or \"consciousness\") and becomes a malevolent character.[q] These sci-fi scenarios are misleading in several ways.\n\nFirst, AI does not require human-like sentience to be an existential risk. Modern AI programs are given specific goals and use learning and intelligence to achieve them. Philosopher Nick Bostrom argued that if one gives almost any goal to a sufficiently powerful AI, it may choose to destroy humanity to achieve it (he used the example of an automated paperclip factory that destroys the world to get more iron for paperclips).[304] Stuart Russell gives the example of household robot that tries to find a way to kill its owner to prevent it from being unplugged, reasoning that \"you can't fetch the coffee if you're dead.\"[305] In order to be safe for humanity, a superintelligence would have to be genuinely aligned with humanity's morality and values so that it is \"fundamentally on our side\".[306]\n\nSecond, Yuval Noah Harari argues that AI does not require a robot body or physical control to pose an existential risk. The essential parts of civilization are not physical. Things like ideologies, law, government, money and the economy are built on language; they exist because there are stories that billions of people believe. The current prevalence of misinformation suggests that an AI could use language to convince people to believe anything, even to take actions that are destructive.[307] Geoffrey Hinton said in 2025 that modern AI is particularly \"good at persuasion\" and getting better all the time. He asks \"Suppose you wanted to invade the capital of the US. Do you have to go there and do it yourself? No. You just have to be good at persuasion.\"[308]\n\nThe opinions amongst experts and industry insiders are mixed, with sizable fractions both concerned and unconcerned by risk from eventual superintelligent AI.[309] Personalities such as Stephen Hawking, Bill Gates, and Elon Musk,[310] as well as AI pioneers such as Geoffrey Hinton, Yoshua Bengio, Stuart Russell, Demis Hassabis, and Sam Altman, have expressed concerns about existential risk from AI.\n\nIn May 2023, Geoffrey Hinton announced his resignation from Google in order to be able to \"freely speak out about the risks of AI\" without \"considering how this impacts Google\".[311] He notably mentioned risks of an AI takeover,[312] and stressed that in order to avoid the worst outcomes, establishing safety guidelines will require cooperation among those competing in use of AI.[313]\n\nIn 2023, many leading AI experts endorsed the joint statement that \"Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war\".[314]\n\nSome other researchers were more optimistic. AI pioneer Jürgen Schmidhuber did not sign the joint statement, emphasising that in 95% of all cases, AI research is about making \"human lives longer and healthier and easier.\"[315] While the tools that are now being used to improve lives can also be used by bad actors, \"they can also be used against the bad actors.\"[316][317] Andrew Ng also argued that \"it's a mistake to fall for the doomsday hype on AI-and that regulators who do will only benefit vested interests.\"[318] Yann LeCun \", a Turing Award winner, disagreed with the idea that AI will subordinate humans \"simply because they are smarter, let alone destroy [us]\",[319] \"scoff[ing] at his peers' dystopian scenarios of supercharged misinformation and even, eventually, human extinction.\"[320] In the early 2010s, experts argued that the risks are too distant in the future to warrant research or that humans will be valuable from the perspective of a superintelligent machine.[321] However, after 2016, the study of current and future risks and possible solutions became a serious area of research.[322]\n\n### Ethical machines and alignment\n\nMain articles: Machine ethics, AI safety, Friendly artificial intelligence, Artificial moral agents, and Human Compatible\n\nSee also: Human-AI interaction\n\nFriendly AI are machines that have been designed from the beginning to minimize risks and to make choices that benefit humans. Eliezer Yudkowsky, who coined the term, argues that developing friendly AI should be a higher research priority: it may require a large investment and it must be completed before AI becomes an existential risk.[323]\n\nMachines with intelligence have the potential to use their intelligence to make ethical decisions. The field of machine ethics provides machines with ethical principles and procedures for resolving ethical dilemmas.[324]\nThe field of machine ethics is also called computational morality,[324]\nand was founded at an AAAI symposium in 2005.[325]\n\nOther approaches include Wendell Wallach's \"artificial moral agents\"[326] and Stuart J. Russell's three principles for developing provably beneficial machines.[327]\n\n### Open source\n\nSee also: Open-source artificial intelligence and Lists of open-source artificial intelligence software\n\nActive organizations in the AI open-source community include Hugging Face,[328] Google,[329] EleutherAI and Meta.[330] Various AI models, such as Llama 2, Mistral or Stable Diffusion, have been made open-weight,[331][332] meaning that their architecture and trained parameters (the \"weights\") are publicly available. Open-weight models can be freely fine-tuned, which allows companies to specialize them with their own data and for their own use-case.[333] Open-weight models are useful for research and innovation but can also be misused. Since they can be fine-tuned, any built-in security measure, such as objecting to harmful requests, can be trained away until it becomes ineffective. Some researchers warn that future AI models may develop dangerous capabilities (such as the potential to drastically facilitate bioterrorism) and that once released on the Internet, they cannot be deleted everywhere if needed. They recommend pre-release audits and cost-benefit analyses.[334]\n\n### Frameworks\n\nArtificial intelligence projects can be guided by ethical considerations during the design, development, and implementation of an AI system. An AI framework such as the Care and Act Framework, developed by the Alan Turing Institute and based on the SUM values, outlines four main ethical dimensions, defined as follows:[335][336]\n\n• Respect the dignity of individual people\n\n• Connect with other people sincerely, openly, and inclusively\n\n• Care for the wellbeing of everyone\n\n• Protect social values, justice, and the public interest\n\nOther developments in ethical frameworks include those decided upon during the Asilomar Conference, the Montreal Declaration for Responsible AI, and the IEEE's Ethics of Autonomous Systems initiative, among others;[337] however, these principles are not without criticism, especially regarding the people chosen to contribute to these frameworks.[338]\n\nPromotion of the wellbeing of the people and communities that these technologies affect requires consideration of the social and ethical implications at all stages of AI system design, development and implementation, and collaboration between job roles such as data scientists, product managers, data engineers, domain experts, and delivery managers.[339]\n\nThe UK AI Safety Institute released in 2024 a testing toolset called 'Inspect' for AI safety evaluations available under an MIT open-source licence which is freely available on GitHub and can be improved with third-party packages. It can be used to evaluate AI models in a range of areas including core knowledge, ability to reason, and autonomous capabilities.[340]\n\n### Regulation\n\nMain articles: Regulation of artificial intelligence, Regulation of algorithms, and AI safety\n\nThe first global AI Safety Summit was held in the United Kingdom in November 2023 with a declaration calling for international cooperation.\n\nThe regulation of artificial intelligence is the development of public sector policies and laws for promoting and regulating AI; it is therefore related to the broader regulation of algorithms.[341] The regulatory and policy landscape for AI is an emerging issue in jurisdictions globally.[342] According to AI Index at Stanford, the annual number of AI-related laws passed in the 127 survey countries jumped from one passed in 2016 to 37 passed in 2022 alone.[343][344] Between 2016 and 2020, more than 30 countries adopted dedicated strategies for AI.[345] Most EU member states had released national AI strategies, as had Canada, China, India, Japan, Mauritius, the Russian Federation, Saudi Arabia, United Arab Emirates, U. S., and Vietnam. Others were in the process of elaborating their own AI strategy, including Bangladesh, Malaysia and Tunisia.[345] The Global Partnership on Artificial Intelligence was launched in June 2020, stating a need for AI to be developed in accordance with human rights and democratic values, to ensure public confidence and trust in the technology.[345] Henry Kissinger, Eric Schmidt, and Daniel Huttenlocher published a joint statement in November 2021 calling for a government commission to regulate AI.[346] In 2023, OpenAI leaders published recommendations for the governance of superintelligence, which they believe may happen in less than 10 years.[347] In 2023, the United Nations also launched an advisory body to provide recommendations on AI governance; the body comprises technology company executives, government officials and academics.[348] On 1 August 2024, the EU Artificial Intelligence Act entered into force, establishing the first comprehensive EU-wide AI regulation.[349] In 2024, the Council of Europe created the first international legally binding treaty on AI, called the \"Framework Convention on Artificial Intelligence and Human Rights, Democracy and the Rule of Law\". It was adopted by the European Union, the United States, the United Kingdom, and other signatories.[350]\n\nIn a 2022 Ipsos survey, attitudes towards AI varied greatly by country; 78% of Chinese citizens, but only 35% of Americans, agreed that \"products and services using AI have more benefits than drawbacks\".[343] A 2023 Reuters/Ipsos poll found that 61% of Americans agree, and 22% disagree, that AI poses risks to humanity.[351] In a 2023 Fox News poll, 35% of Americans thought it \"very important\", and an additional 41% thought it \"somewhat important\", for the federal government to regulate AI, versus 13% responding \"not very important\" and 8% responding \"not at all important\".[352][353]\n\nIn November 2023, the first global AI Safety Summit was held in Bletchley Park in the UK to discuss the near and far term risks of AI and the possibility of mandatory and voluntary regulatory frameworks.[354] 28 countries including the United States, China, and the European Union issued a declaration at the start of the summit, calling for international co-operation to manage the challenges and risks of artificial intelligence.[355][356] In May 2024 at the AI Seoul Summit, 16 global AI tech companies agreed to safety commitments on the development of AI.[357][358]\n\n## History\n\nMain article: History of artificial intelligence\n\nFor a chronological guide, see Timeline of artificial intelligence.\n\nIn 2024, AI patents in China and the US numbered more than three-fourths of AI patents worldwide.[359] Though China had more AI patents, the US had 35% more patents per AI patent-applicant company than China.[359]\n\nThe study of mechanical or \"formal\" reasoning began with philosophers and mathematicians in antiquity. The study of logic led directly to Alan Turing's theory of computation, which suggested that a machine, by shuffling symbols as simple as \"0\" and \"1\", could simulate any conceivable form of mathematical reasoning.[360][361] This, along with concurrent discoveries in cybernetics, information theory and neurobiology, led researchers to consider the possibility of building an \"electronic brain\".[r] They developed several areas of research that would become part of AI,[363] such as McCulloch and Pitts design for \"artificial neurons\" in 1943,[117] and Turing's influential 1950 paper 'Computing Machinery and Intelligence', which introduced the Turing test and showed that \"machine intelligence\" was plausible.[364][361]\n\nThe field of AI research was founded at a workshop at Dartmouth College in 1956.[s][6] The attendees became the leaders of AI research in the 1960s.[t] They and their students produced programs that the press described as \"astonishing\":[u] computers were learning checkers strategies, solving word problems in algebra, proving logical theorems and speaking English.[v][7] Artificial intelligence laboratories were set up at a number of British and U. S. universities in the latter 1950s and early 1960s.[361]\n\nResearchers in the 1960s and the 1970s were convinced that their methods would eventually succeed in creating a machine with general intelligence and considered this the goal of their field.[368] In 1965 Herbert Simon predicted, \"machines will be capable, within twenty years, of doing any work a man can do\".[369] In 1967 Marvin Minsky agreed, writing that \"within a generation... the problem of creating 'artificial intelligence' will substantially be solved\".[370] They had, however, underestimated the difficulty of the problem.[w] In 1974, both the U. S. and British governments cut off exploratory research in response to the criticism of Sir James Lighthill[372] and ongoing pressure from the U. S. Congress to fund more productive projects.[373] Minsky and Papert's book Perceptrons was understood as proving that artificial neural networks would never be useful for solving real-world tasks, thus discrediting the approach altogether.[374] The \"AI winter\", a period when obtaining funding for AI projects was difficult, followed.[9]\n\nIn the early 1980s, AI research was revived by the commercial success of expert systems,[375] a form of AI program that simulated the knowledge and analytical skills of human experts. By 1985, the market for AI had reached over a billion dollars. At the same time, Japan's fifth generation computer project inspired the U. S. and British governments to restore funding for academic research.[8] However, beginning with the collapse of the Lisp Machine market in 1987, AI once again fell into disrepute, and a second, longer-lasting winter began.[10]\n\nUp to this point, most of AI's funding had gone to projects that used high-level symbols to represent mental objects like plans, goals, beliefs, and known facts. In the 1980s, some researchers began to doubt that this approach would be able to imitate all the processes of human cognition, especially perception, robotics, learning and pattern recognition,[376] and began to look into \"sub-symbolic\" approaches.[377] Rodney Brooks rejected \"representation\" in general and focussed directly on engineering machines that move and survive.[x] Judea Pearl, Lotfi Zadeh, and others developed methods that handled incomplete and uncertain information by making reasonable guesses rather than precise logic.[87][382] But the most important development was the revival of \"connectionism\", including neural network research, by Geoffrey Hinton and others.[383] In 1990, Yann LeCun successfully showed that convolutional neural networks can recognize handwritten digits, the first of many successful applications of neural networks.[384]\n\nAI gradually restored its reputation in the late 1990s and early 21st century by exploiting formal mathematical methods and by finding specific solutions to specific problems. This \"narrow\" and \"formal\" focus allowed researchers to produce verifiable results and collaborate with other fields (such as statistics, economics and mathematics).[385] By 2000, solutions developed by AI researchers were being widely used, although in the 1990s they were rarely described as \"artificial intelligence\" (a tendency known as the AI effect).[386]\nHowever, several academic researchers became concerned that AI was no longer pursuing its original goal of creating versatile, fully intelligent machines. Beginning around 2002, they founded the subfield of artificial general intelligence (or \"AGI\"), which had several well-funded institutions by the 2010s.[68]\n\nDeep learning began to dominate industry benchmarks in 2012 and was adopted throughout the field.[11]\nFor many specific tasks, other methods were abandoned.[y]\nDeep learning's success was based on both hardware improvements (faster computers,[388] graphics processing units, cloud computing[389]) and access to large amounts of data[390] (including curated datasets,[389] such as ImageNet). Deep learning's success led to an enormous increase in interest and funding in AI.[z] The amount of machine learning research (measured by total publications) increased by 50% in the years 2015-2019.[345]\n\nThe number of Google searches for the term \"AI\" accelerated in 2022.\n\nIn 2016, issues of fairness and the misuse of technology were catapulted into center stage at machine learning conferences, publications vastly increased, funding became available, and many researchers re-focussed their careers on these issues. The alignment problem became a serious field of academic study.[322]\n\nIn the late 2010s and early 2020s, AGI companies began to deliver programs that created enormous interest. In 2015, AlphaGo, developed by DeepMind, beat the world champion Go player. The program taught only the game's rules and developed a strategy by itself. GPT-3 is a large language model that was released in 2020 by OpenAI and is capable of generating high-quality human-like text.[391] ChatGPT, launched on 30 November 2022, became the fastest-growing consumer software application in history, gaining over 100 million users in two months.[392] It marked what is widely regarded as AI's breakout year, bringing it into the public consciousness.[393] These programs, and others, inspired an aggressive AI boom, where large companies began investing billions of dollars in AI research. According to AI Impacts, about US$50 billion annually was invested in \"AI\" around 2022 in the U. S. alone and about 20% of the new U. S. Computer Science PhD graduates have specialized in \"AI\".[394] About 800,000 \"AI\"-related U. S. job openings existed in 2022.[395] According to PitchBook research, 22% of newly funded startups in 2024 claimed to be AI companies.[396]\n\n## Philosophy\n\nMain article: Philosophy of artificial intelligence\n\nPhilosophical debates have historically sought to determine the nature of intelligence and how to make intelligent machines.[397] Another major focus has been whether machines can be conscious, and the associated ethical implications.[398] Many other topics in philosophy are relevant to AI, such as epistemology and free will.[399] Rapid advancements have intensified public discussions on the philosophy and ethics of AI.[398]\n\n### Defining artificial intelligence\n\nSee also: Synthetic intelligence, Intelligent agent, Artificial mind, Virtual intelligence, and Dartmouth workshop\n\nAlan Turing wrote in 1950 \"I propose to consider the question 'can machines think'?\"[400] He advised changing the question from whether a machine \"thinks\", to \"whether or not it is possible for machinery to show intelligent behaviour\".[400] He devised the Turing test, which measures the ability of a machine to simulate human conversation.[364] Since we can only observe the behavior of the machine, it does not matter if it is \"actually\" thinking or literally has a \"mind\". Turing notes that we can not determine these things about other people but \"it is usual to have a polite convention that everyone thinks.\"[401]\n\nThe Turing test can provide some evidence of intelligence, but it penalizes non-human intelligent behavior.[402]\n\nRussell and Norvig agree with Turing that intelligence must be defined in terms of external behavior, not internal structure.[1] However, they are critical that the test requires the machine to imitate humans. \"Aeronautical engineering texts\", they wrote, \"do not define the goal of their field as making 'machines that fly so exactly like pigeons that they can fool other pigeons.'\"[403] AI founder John McCarthy agreed, writing that \"Artificial intelligence is not, by definition, simulation of human intelligence\".[404]\n\nMcCarthy defines intelligence as \"the computational part of the ability to achieve goals in the world\".[405] Another AI founder, Marvin Minsky, similarly describes it as \"the ability to solve hard problems\".[406] Artificial Intelligence: A Modern Approach defines it as the study of agents that perceive their environment and take actions that maximize their chances of achieving defined goals.[1]\n\nThe many differing definitiuons of AI have been critically analyzed.[407][408][409] During the 2020s AI boom, the term has been used as a marketing buzzword to promote products and services which do not use AI.[410]\n\n#### Legal definitions\n\nThe International Organization for Standardization describes an AI system as a \"an engineered system that generates outputs such as content, forecasts, recommendations, or decisions for a given set of human-defined objectives, and can operate with varying levels of automation\".[411] The EU AI Act defines an AI system as \"a machine-based system that is designed to operate with varying levels of autonomy and that may exhibit adaptiveness after deployment, and that, for explicit or implicit objectives, infers, from the input it receives, how to generate outputs such as predictions, content, recommendations, or decisions that can influence physical or virtual environments\".[412] In the United States, influential but non-binding guidance such as the National Institute of Standards and Technology's AI Risk Management Framework describes an AI system as \"an engineered or machine-based system that can, for a given set of objectives, generate outputs such as predictions, recommendations, or decisions influencing real or virtual environments. AI systems are designed to operate with varying levels of autonomy\".[413]\n\n### Evaluating approaches to AI\n\nNo established unifying theory or paradigm has guided AI research for most of its history.[aa] The unprecedented success of statistical machine learning in the 2010s eclipsed all other approaches (so much so that some sources, especially in the business world, use the term \"artificial intelligence\" to mean \"machine learning with neural networks\"). This approach is mostly sub-symbolic, soft and narrow. Critics argue that these questions may have to be revisited by future generations of AI researchers.\n\n#### Symbolic AI and its limits\n\nSymbolic AI (or \"GOFAI\")[415] simulated the high-level conscious reasoning that people use when they solve puzzles, express legal reasoning and do mathematics. They were highly successful at \"intelligent\" tasks such as algebra or IQ tests. In the 1960s, Newell and Simon proposed the physical symbol systems hypothesis: \"A physical symbol system has the necessary and sufficient means of general intelligent action.\"[416]\n\nHowever, the symbolic approach failed on many tasks that humans solve easily, such as learning, recognizing an object or commonsense reasoning. Moravec's paradox is the discovery that high-level \"intelligent\" tasks were easy for AI, but low level \"instinctive\" tasks were extremely difficult.[417] Philosopher Hubert Dreyfus had argued since the 1960s that human expertise depends on unconscious instinct rather than conscious symbol manipulation, and on having a \"feel\" for the situation, rather than explicit symbolic knowledge.[418] Although his arguments had been ridiculed and ignored when they were first presented, eventually, AI research came to agree with him.[ab][16]\n\nThe issue is not resolved: sub-symbolic reasoning can make many of the same inscrutable mistakes that human intuition does, such as algorithmic bias. Critics such as Noam Chomsky argue continuing research into symbolic AI will still be necessary to attain general intelligence,[420][421] in part because sub-symbolic AI is a move away from explainable AI: it can be difficult or impossible to understand why a modern statistical AI program made a particular decision. The emerging field of neuro-symbolic artificial intelligence attempts to bridge the two approaches.\n\n#### Neat vs. scruffy\n\nMain article: Neats and scruffies\n\n\"Neats\" hope that intelligent behavior is described using simple, elegant principles (such as logic, optimization, or neural networks). \"Scruffies\" expect that it necessarily requires solving a large number of unrelated problems. Neats defend their programs with theoretical rigor, scruffies rely mainly on incremental testing to see if they work. This issue was actively discussed in the 1970s and 1980s,[422] but eventually was seen as irrelevant. Modern AI has elements of both.\n\n#### Soft vs. hard computing\n\nMain article: Soft computing\n\nFinding a provably correct or optimal solution is intractable for many important problems.[15] Soft computing is a set of techniques, including genetic algorithms, fuzzy logic and neural networks, that are tolerant of imprecision, uncertainty, partial truth and approximation. Soft computing was introduced in the late 1980s and most successful AI programs in the 21st century are examples of soft computing with neural networks.\n\n#### Narrow vs. general AI\n\nMain articles: Weak artificial intelligence and Artificial general intelligence\n\nAI researchers are divided as to whether to pursue the goals of artificial general intelligence and superintelligence directly or to solve as many specific problems as possible (narrow AI) in hopes these solutions will lead indirectly to the field's long-term goals.[423][424] General intelligence is difficult to define and difficult to measure, and modern AI has had more verifiable successes by focusing on specific problems with specific solutions. The sub-field of artificial general intelligence studies this area exclusively.\n\n### Machine consciousness, sentience, and mind\n\nMain articles: Philosophy of artificial intelligence and Artificial consciousness\n\nThere is no settled consensus in philosophy of mind on whether a machine can have a mind, consciousness and mental states in the same sense that human beings do. This issue considers the internal experiences of the machine, rather than its external behavior. Mainstream AI research considers this issue irrelevant because it does not affect the goals of the field: to build machines that can solve problems using intelligence. Russell and Norvig add that \"[t]he additional project of making a machine conscious in exactly the way humans are is not one that we are equipped to take on.\"[425] However, the question has become central to the philosophy of mind. It is also typically the central question at issue in artificial intelligence in fiction.\n\n#### Consciousness\n\nMain articles: Hard problem of consciousness and Theory of mind\n\nDavid Chalmers identified two problems in understanding the mind, which he named the \"hard\" and \"easy\" problems of consciousness.[426] The easy problem is understanding how the brain processes signals, makes plans and controls behavior. The hard problem is explaining how this feels or why it should feel like anything at all, assuming we are right in thinking that it truly does feel like something (Dennett's consciousness illusionism says this is an illusion). While human information processing is easy to explain, human subjective experience is difficult to explain. For example, it is easy to imagine a color-blind person who has learned to identify which objects in their field of view are red, but it is not clear what would be required for the person to know what red looks like.[427]\n\n#### Computationalism and functionalism\n\nMain articles: Computational theory of mind and Functionalism (philosophy of mind)\n\nComputationalism is the position in the philosophy of mind that the human mind is an information processing system and that thinking is a form of computing. Computationalism argues that the relationship between mind and body is similar or identical to the relationship between software and hardware and thus may be a solution to the mind-body problem. This philosophical position was inspired by the work of AI researchers and cognitive scientists in the 1960s and was originally proposed by philosophers Jerry Fodor and Hilary Putnam.[428]\n\nPhilosopher John Searle characterized this position as \"strong AI\": \"The appropriately programmed computer with the right inputs and outputs would thereby have a mind in exactly the same sense human beings have minds.\"[ac] Searle challenges this claim with his Chinese room argument, which attempts to show that even a computer capable of perfectly simulating human behavior would not have a mind.[432]\n\n#### AI welfare and rights\n\nIt is difficult or impossible to reliably evaluate whether an advanced AI is sentient (has the ability to feel), and if so, to what degree.[433] But if there is a significant chance that a given machine can feel and suffer, then it may be entitled to certain rights or welfare protection measures, similarly to animals.[434][435] Sapience (a set of capacities related to high intelligence, such as discernment or self-awareness) may provide another moral basis for AI rights.[434] Robot rights are also sometimes proposed as a practical way to integrate autonomous agents into society.[436]\n\nIn 2017, the European Union considered granting \"electronic personhood\" to some of the most capable AI systems. Similarly to the legal status of companies, it would have conferred rights but also responsibilities.[437] Critics argued in 2018 that granting rights to AI systems would downplay the importance of human rights, and that legislation should focus on user needs rather than speculative futuristic scenarios. They also noted that robots lacked the autonomy to take part in society on their own.[438][439]\n\nProgress in AI increased interest in the topic. Proponents of AI welfare and rights often argue that AI sentience, if it emerges, would be particularly easy to deny. They warn that this may be a moral blind spot analogous to slavery or factory farming, which could lead to large-scale suffering if sentient AI is created and carelessly exploited.[435][434]\n\n## Future\n\n### Superintelligence and the singularity\n\nA superintelligence is a hypothetical agent that would possess intelligence far surpassing that of the brightest and most gifted human mind.[424] If research into artificial general intelligence produced sufficiently intelligent software, it might be able to reprogram and improve itself. The improved software would be even better at improving itself, leading to what I. J. Good called an \"intelligence explosion\" and Vernor Vinge called a \"singularity\".[440]\n\nHowever, technologies cannot improve exponentially indefinitely, and typically follow an S-shaped curve, slowing when they reach the physical limits of what the technology can do.[441]\n\n### Transhumanism\n\nMain article: Transhumanism\n\nRobot designer Hans Moravec, cyberneticist Kevin Warwick and inventor Ray Kurzweil have predicted that humans and machines may merge in the future into cyborgs that are more capable and powerful than either. This idea, called transhumanism, has roots in the writings of Aldous Huxley and Robert Ettinger.[442]\n\nEdward Fredkin argues that \"artificial intelligence is the next step in evolution\", an idea first proposed by Samuel Butler's \"Darwin among the Machines\" as far back as 1863, and expanded upon by George Dyson in his 1998 book Darwin Among the Machines: The Evolution of Global Intelligence.[443]\n\n## In fiction\n\nMain article: Artificial intelligence in fiction\n\nThe word \"robot\" itself was coined by Karel Čapek in his 1921 play R. U. R., the title standing for \"Rossum's Universal Robots\".\n\nThought-capable artificial beings have appeared as storytelling devices since antiquity,[444] and have been a persistent theme in science fiction.[445]\n\nA common trope in these works began with Mary Shelley's Frankenstein, where a human creation becomes a threat to its masters. This includes such works as Arthur C. Clarke's and Stanley Kubrick's 2001: A Space Odyssey (both 1968), with HAL 9000, the murderous computer in charge of the Discovery One spaceship, as well as The Terminator (1984) and The Matrix (1999). In contrast, the rare loyal robots such as Gort from The Day the Earth Stood Still (1951) and Bishop from Aliens (1986) are less prominent in popular culture.[446]\n\nIsaac Asimov introduced the Three Laws of Robotics in many stories, most notably with the \"Multivac\" super-intelligent computer. Asimov's laws are often brought up during lay discussions of machine ethics;[447] while almost all artificial intelligence researchers are familiar with Asimov's laws through popular culture, they generally consider the laws useless for many reasons, one of which is their ambiguity.[448]\n\nSeveral works use AI to force us to confront the fundamental question of what makes us human, showing us artificial beings that have the ability to feel, and thus to suffer. This appears in Karel Čapek's R. U. R., the films A. I. Artificial Intelligence and Ex Machina, as well as the novel Do Androids Dream of Electric Sheep?, by Philip K. Dick. Dick considers the idea that our understanding of human subjectivity is altered by technology created with artificial intelligence.[449]\n\n## See also\n\n• Artificial consciousness - Field in cognitive science\n\n• Artificial intelligence and elections - Impact of AI on political elections\n\n• Artificial intelligence content detection - Software to detect AI-generated content\n\n• Artificial intelligence in Wikimedia projects - Use of artificial intelligence to develop Wikipedia and other Wikimedia projects\n\n• Association for the Advancement of Artificial Intelligence (AAAI)\n\n• Behavior selection algorithm - Algorithm that selects actions for intelligent agents\n\n• Business process automation - Automation of business processes\n\n• Case-based reasoning - Process of solving new problems based on the solutions of similar past problems\n\n• Computational intelligence - Ability of a computer to learn a specific task from data or experimental observation\n\n• DARWIN EU - A European Union initiative coordinated by the European Medicines Agency (EMA) to generate and utilize real world evidence (RWE) to support the evaluation and supervision of medicines across the EU\n\n• Digital immortality - Hypothetical concept of storing a personality in digital form\n\n• Emergent algorithm - Algorithm exhibiting emergent behavior\n\n• Female gendering of AI technologies - Gender biases in digital technology\n\n• Glossary of artificial intelligence - List of concepts in artificial intelligence\n\n• Intelligence amplification - Use of information technology to augment human intelligence\n\n• Intelligent agent - Software agent which acts autonomously\n\n• Intelligent automation - Software process that combines robotic process automation and artificial intelligence\n\n• List of artificial intelligence books\n\n• List of artificial intelligence journals\n\n• List of artificial intelligence projects\n\n• Mind uploading - Hypothetical process of digitally emulating a brain\n\n• Organoid intelligence - Use of brain cells and brain organoids for intelligent computing\n\n• Pseudorandomness - Appearing random but actually being generated by a deterministic, causal process\n\n• Robotic process automation - Form of business process automation technology\n\n• The Last Day - 1967 Welsh science fiction novel\n\n• Wetware computer - Computer composed of organic material\n\n## Explanatory notes\n\n• ^ a b This list of intelligent traits is based on the topics covered by the major AI textbooks, including: Russell & Norvig (2021), Luger & Stubblefield (2004), Poole, Mackworth & Goebel (1998) and Nilsson (1998)\n\n• ^ a b This list of tools is based on the topics covered by the major AI textbooks, including: Russell & Norvig (2021), Luger & Stubblefield (2004), Poole, Mackworth & Goebel (1998) and Nilsson (1998)\n\n• ^ It is among the reasons that expert systems proved to be inefficient for capturing knowledge.[30][31]\n\n• ^\n\"Rational agent\" is general term used in economics, philosophy and theoretical artificial intelligence. It can refer to anything that directs its behavior to accomplish goals, such as a person, an animal, a corporation, a nation, or in the case of AI, a computer program.\n\n• ^ Alan Turing discussed the centrality of learning as early as 1950, in his classic paper \"Computing Machinery and Intelligence\".[42] In 1956, at the original Dartmouth AI summer conference, Ray Solomonoff wrote a report on unsupervised probabilistic machine learning: \"An Inductive Inference Machine\".[43]\n\n• ^ See AI winter § Machine translation and the ALPAC report of 1966.\n\n• ^\nCompared with symbolic logic, formal Bayesian inference is computationally expensive. For inference to be tractable, most observations must be conditionally independent of one another. AdSense uses a Bayesian network with over 300 million edges to learn which ads to serve.[94]\n\n• ^ Expectation-maximization, one of the most popular algorithms in machine learning, allows clustering in the presence of unknown latent variables.[96]\n\n• ^\nSome form of deep neural networks (without a specific learning algorithm) were described by:\nWarren S. McCulloch and Walter Pitts (1943)[117]\nAlan Turing (1948);[118]\nKarl Steinbuch and Roger David Joseph (1961).[119]\nDeep or recurrent networks that learned (or used gradient descent) were developed by:\nFrank Rosenblatt(1957);[118]\nOliver Selfridge (1959);[119]\nAlexey Ivakhnenko and Valentin Lapa (1965);[120]\nKaoru Nakano (1971);[121]\nShun-Ichi Amari (1972);[121]\nJohn Joseph Hopfield (1982).[121]\nPrecursors to backpropagation were developed by:\nHenry J. Kelley (1960);[118]\nArthur E. Bryson (1962);[118]\nStuart Dreyfus (1962);[118]\nArthur E. Bryson and Yu-Chi Ho (1969);[118]\nBackpropagation was independently developed by:\nSeppo Linnainmaa (1970);[122]\nPaul Werbos (1974).[118]\n\n• ^ Geoffrey Hinton said, of his work on neural networks in the 1990s, \"our labeled datasets were thousands of times too small. [And] our computers were millions of times too slow.\"[123]\n\n• ^ In statistics, a bias is a systematic error or deviation from the correct value. But in the context of fairness, it refers to a tendency in favor or against a certain group or individual characteristic, usually in a way that is considered unfair or harmful. A statistically unbiased AI system that produces disparate outcomes for different demographic groups may thus be viewed as biased in the ethical sense.[252]\n\n• ^ Including Jon Kleinberg (Cornell University), Sendhil Mullainathan (University of Chicago), Cynthia Chouldechova (Carnegie Mellon) and Sam Corbett-Davis (Stanford)[262]\n\n• ^ Moritz Hardt (a director at the Max Planck Institute for Intelligent Systems) argues that machine learning \"is fundamentally the wrong tool for a lot of domains, where you're trying to design interventions and mechanisms that change the world.\"[267]\n\n• ^ When the law was passed in 2018, it still contained a form of this provision.\n\n• ^ This is the United Nations' definition, and includes things like land mines as well.[283]\n\n• ^ See table 4; 9% is both the OECD average and the U. S. average.[294]\n\n• ^ Sometimes called a \"robopocalypse\"[303]\n\n• ^ \"Electronic brain\" was the term used by the press around this time.[360][362]\n\n• ^\nDaniel Crevier wrote, \"the conference is generally recognized as the official birthdate of the new science.\"[365] Russell and Norvig called the conference \"the inception of artificial intelligence.\"[117]\n\n• ^\nRussell and Norvig wrote \"for the next 20 years the field would be dominated by these people and their students.\"[366]\n\n• ^\nRussell and Norvig wrote, \"it was astonishing whenever a computer did anything kind of smartish\".[367]\n\n• ^\nThe programs described are Arthur Samuel's checkers program for the IBM 701, Daniel Bobrow's STUDENT, Newell and Simon's Logic Theorist and Terry Winograd's SHRDLU.\n\n• ^ Russell and Norvig write: \"in almost all cases, these early systems failed on more difficult problems\"[371]\n\n• ^\nEmbodied approaches to AI[378] were championed by Hans Moravec[379] and Rodney Brooks[380] and went by many names: Nouvelle AI.[380] Developmental robotics.[381]\n\n• ^ Matteo Wong wrote in The Atlantic: \"Whereas for decades, computer-science fields such as natural-language processing, computer vision, and robotics used extremely different methods, now they all use a programming method called \"deep learning\". As a result, their code and approaches have become more similar, and their models are easier to integrate into one another.\"[387]\n\n• ^ Jack Clark wrote in Bloomberg: \"After a half-decade of quiet breakthroughs in artificial intelligence, 2015 has been a landmark year. Computers are smarter and learning faster than ever\", and noted that the number of software projects that use machine learning at Google increased from a \"sporadic usage\" in 2012 to more than 2,700 projects in 2015.[389]\n\n• ^ Nils Nilsson wrote in 1983: \"Simply put, there is wide disagreement in the field about what AI is all about.\"[414]\n\n• ^\nDaniel Crevier wrote that \"time has proven the accuracy and perceptiveness of some of Dreyfus's comments. Had he formulated them less aggressively, constructive actions they suggested might have been taken much earlier.\"[419]\n\n• ^\nSearle presented this definition of \"Strong AI\" in 1999.[429] Searle's original formulation was \"The appropriately programmed computer really is a mind, in the sense that computers given the right programs can be literally said to understand and have other cognitive states.\"[430] Strong AI is defined similarly by Russell and Norvig: \"Stong AI - the assertion that machines that do so are actually thinking (as opposed to simulating thinking).\"[431]\n\n## References\n\n• ^ a b c Russell & Norvig (2021), pp. 1-4.\n\n• ^ AI set to exceed human brain power Archived 19 February 2008 at the Wayback Machine CNN. com (26 July 2006)\n\n• ^ Kaplan, Andreas; Haenlein, Michael (2019). \"Siri, Siri, in my hand: Who's the fairest in the land? On the interpretations, illustrations, and implications of artificial intelligence\". Business Horizons. 62: 15-25. doi:10.1016/j. bushor.2018.08.004. [the question of the source is a pastiche of: Snow White]\n\n• ^ Russell & Norvig (2021, §1.2).\n\n• ^ \"Tech companies want to build artificial general intelligence. But who decides when AGI is attained?\". AP News. 4 April 2024. Retrieved 20 May 2025.\n\n• ^ a b Dartmouth workshop: Russell & Norvig (2021, p. 18), McCorduck (2004, pp. 111-136), NRC (1999, pp. 200-201)\n\nThe proposal: McCarthy et al. (1955)\n\n• ^ a b Successful programs of the 1960s: McCorduck (2004, pp. 243-252), Crevier (1993, pp. 52-107), Moravec (1988, p. 9), Russell & Norvig (2021, pp. 19-21)\n\n• ^ a b Funding initiatives in the early 1980s: Fifth Generation Project (Japan), Alvey (UK), Microelectronics and Computer Technology Corporation (US), Strategic Computing Initiative (US): McCorduck (2004, pp. 426-441), Crevier (1993, pp. 161-162, 197-203, 211, 240), Russell & Norvig (2021, p. 23), NRC (1999, pp. 210-211), Newquist (1994, pp. 235-248)\n\n• ^ a b First AI Winter, Lighthill report, Mansfield Amendment: Crevier (1993, pp. 115-117), Russell & Norvig (2021, pp. 21-22), NRC (1999, pp. 212-213), Howe (1994), Newquist (1994, pp. 189-201)\n\n• ^ a b Second AI Winter: Russell & Norvig (2021, p. 24), McCorduck (2004, pp. 430-435), Crevier (1993, pp. 209-210), NRC (1999, pp. 214-216), Newquist (1994, pp. 301-318)\n\n• ^ a b Deep learning revolution, AlexNet: Goldman (2022), Russell & Norvig (2021, p. 26), McKinsey (2018)\n\n• ^ Toews (2023).\n\n• ^ Problem-solving, puzzle solving, game playing, and deduction: Russell & Norvig (2021, chpt. 3-5), Russell & Norvig (2021, chpt. 6) (constraint satisfaction), Poole, Mackworth & Goebel (1998, chpt. 2, 3, 7, 9), Luger & Stubblefield (2004, chpt. 3, 4, 6, 8), Nilsson (1998, chpt. 7-12)\n\n• ^ Uncertain reasoning: Russell & Norvig (2021, chpt. 12-18), Poole, Mackworth & Goebel (1998, pp. 345-395), Luger & Stubblefield (2004, pp. 333-381), Nilsson (1998, chpt. 7-12)\n\n• ^ a b c Intractability and efficiency and the combinatorial explosion: Russell & Norvig (2021, p. 21)\n\n• ^ a b c Psychological evidence of the prevalence of sub-symbolic reasoning and knowledge: Kahneman (2011), Dreyfus & Dreyfus (1986), Wason & Shapiro (1966), Kahneman, Slovic & Tversky (1982)\n\n• ^ Knowledge representation and knowledge engineering: Russell & Norvig (2021, chpt. 10), Poole, Mackworth & Goebel (1998, pp. 23-46, 69-81, 169-233, 235-277, 281-298, 319-345), Luger & Stubblefield (2004, pp. 227-243), Nilsson (1998, chpt. 17.1-17.4, 18)\n\n• ^ Smoliar & Zhang (1994).\n\n• ^ Neumann & Möller (2008).\n\n• ^ Kuperman, Reichley & Bailey (2006).\n\n• ^ McGarry (2005).\n\n• ^ Bertini, Del Bimbo & Torniai (2006).\n\n• ^ Russell & Norvig (2021), pp. 272.\n\n• ^ Representing categories and relations: Semantic networks, description logics, inheritance (including frames, and scripts): Russell & Norvig (2021, §10.2 & 10.5), Poole, Mackworth & Goebel (1998, pp. 174-177), Luger & Stubblefield (2004, pp. 248-258), Nilsson (1998, chpt. 18.3)\n\n• ^ Representing events and time: Situation calculus, event calculus, fluent calculus (including solving the frame problem): Russell & Norvig (2021, §10.3), Poole, Mackworth & Goebel (1998, pp. 281-298), Nilsson (1998, chpt. 18.2)\n\n• ^ Causal calculus: Poole, Mackworth & Goebel (1998, pp. 335-337)\n\n• ^ Representing knowledge about knowledge: Belief calculus, modal logics: Russell & Norvig (2021, §10.4), Poole, Mackworth & Goebel (1998, pp. 275-277)\n\n• ^ a b Default reasoning, Frame problem, default logic, non-monotonic logics, circumscription, closed world assumption, abduction: Russell & Norvig (2021, §10.6), Poole, Mackworth & Goebel (1998, pp. 248-256, 323-335), Luger & Stubblefield (2004, pp. 335-363), Nilsson (1998, ~18.3.3)\n(Poole et al. places abduction under \"default reasoning\". Luger et al. places this under \"uncertain reasoning\").\n\n• ^ a b Breadth of commonsense knowledge: Lenat & Guha (1989, Introduction), Crevier (1993, pp. 113-114), Moravec (1988, p. 13), Russell & Norvig (2021, pp. 241, 385, 982) (qualification problem)\n\n• ^ Newquist (1994), p. 296.\n\n• ^ Crevier (1993), pp. 204-208.\n\n• ^ Russell & Norvig (2021), p. 528.\n\n• ^ Automated planning: Russell & Norvig (2021, chpt. 11).\n\n• ^ Automated decision making, Decision theory: Russell & Norvig (2021, chpt. 16-18).\n\n• ^ Classical planning: Russell & Norvig (2021, Section 11.2).\n\n• ^ Sensorless or \"conformant\" planning, contingent planning, replanning (a. k. a. online planning): Russell & Norvig (2021, Section 11.5).\n\n• ^ Uncertain preferences: Russell & Norvig (2021, Section 16.7)\nInverse reinforcement learning: Russell & Norvig (2021, Section 22.6)\n\n• ^ Information value theory: Russell & Norvig (2021, Section 16.6).\n\n• ^ Markov decision process: Russell & Norvig (2021, chpt. 17).\n\n• ^ Game theory and multi-agent decision theory: Russell & Norvig (2021, chpt. 18).\n\n• ^ Learning: Russell & Norvig (2021, chpt. 19-22), Poole, Mackworth & Goebel (1998, pp. 397-438), Luger & Stubblefield (2004, pp. 385-542), Nilsson (1998, chpt. 3.3, 10.3, 17.5, 20)\n\n• ^ Turing (1950).\n\n• ^ Solomonoff (1956).\n\n• ^ Unsupervised learning: Russell & Norvig (2021, pp. 653) (definition), Russell & Norvig (2021, pp. 738-740) (cluster analysis), Russell & Norvig (2021, pp. 846-860) (word embedding)\n\n• ^ a b Supervised learning: Russell & Norvig (2021, §19.2) (Definition), Russell & Norvig (2021, Chpt. 19-20) (Techniques)\n\n• ^ Reinforcement learning: Russell & Norvig (2021, chpt. 22), Luger & Stubblefield (2004, pp. 442-449)\n\n• ^ Transfer learning: Russell & Norvig (2021, pp. 281), The Economist (2016)\n\n• ^ \"Artificial Intelligence (AI): What Is AI and How Does It Work? | Built In\". builtin. com. Retrieved 30 October 2023.\n\n• ^ Computational learning theory: Russell & Norvig (2021, pp. 672-674), Jordan & Mitchell (2015)\n\n• ^ Natural language processing (NLP): Russell & Norvig (2021, chpt. 23-24), Poole, Mackworth & Goebel (1998, pp. 91-104), Luger & Stubblefield (2004, pp. 591-632)\n\n• ^ Subproblems of NLP: Russell & Norvig (2021, pp. 849-850)\n\n• ^ Russell & Norvig (2021), pp. 856-858.\n\n• ^ Dickson (2022).\n\n• ^ Modern statistical and deep learning approaches to NLP: Russell & Norvig (2021, chpt. 24), Cambria & White (2014)\n\n• ^ Vincent (2019).\n\n• ^ Russell & Norvig (2021), pp. 875-878.\n\n• ^ Bushwick (2023).\n\n• ^ Computer vision: Russell & Norvig (2021, chpt. 25), Nilsson (1998, chpt. 6)\n\n• ^ Russell & Norvig (2021), pp. 849-850.\n\n• ^ Russell & Norvig (2021), pp. 895-899.\n\n• ^ Russell & Norvig (2021), pp. 899-901.\n\n• ^ Challa et al. (2011).\n\n• ^ Russell & Norvig (2021), pp. 931-938.\n\n• ^ MIT AIL (2014).\n\n• ^ Affective computing: Thro (1993), Edelson (1991), Tao & Tan (2005), Scassellati (2002)\n\n• ^ Waddell (2018).\n\n• ^ Poria et al. (2017).\n\n• ^ a b\nArtificial general intelligence: Russell & Norvig (2021, pp. 32-33, 1020-1021)\n\nProposal for the modern version: Pennachin & Goertzel (2007)\n\nWarnings of overspecialization in AI from leading researchers: Nilsson (1995), McCarthy (2007), Beal & Winston (2009)\n\n• ^ Search algorithms: Russell & Norvig (2021, chpts. 3-5), Poole, Mackworth & Goebel (1998, pp. 113-163), Luger & Stubblefield (2004, pp. 79-164, 193-219), Nilsson (1998, chpts. 7-12)\n\n• ^ State space search: Russell & Norvig (2021, chpt. 3)\n\n• ^ Russell & Norvig (2021), sect. 11.2.\n\n• ^ Uninformed searches (breadth first search, depth-first search and general state space search): Russell & Norvig (2021, sect. 3.4), Poole, Mackworth & Goebel (1998, pp. 113-132), Luger & Stubblefield (2004, pp. 79-121), Nilsson (1998, chpt. 8)\n\n• ^ Heuristic or informed searches (e. g., greedy best first and A*): Russell & Norvig (2021, sect. 3.5), Poole, Mackworth & Goebel (1998, pp. 132-147), Poole & Mackworth (2017, sect. 3.6), Luger & Stubblefield (2004, pp. 133-150)\n\n• ^ Adversarial search: Russell & Norvig (2021, chpt. 5)\n\n• ^ Local or \"optimization\" search: Russell & Norvig (2021, chpt. 4)\n\n• ^ Singh Chauhan, Nagesh (18 December 2020). \"Optimization Algorithms in Neural Networks\". KDnuggets. Retrieved 13 January 2024.\n\n• ^ Evolutionary computation: Russell & Norvig (2021, sect. 4.1.2)\n\n• ^ Merkle & Middendorf (2013).\n\n• ^ Logic: Russell & Norvig (2021, chpts. 6-9), Luger & Stubblefield (2004, pp. 35-77), Nilsson (1998, chpt. 13-16)\n\n• ^ Propositional logic: Russell & Norvig (2021, chpt. 6), Luger & Stubblefield (2004, pp. 45-50), Nilsson (1998, chpt. 13)\n\n• ^ First-order logic and features such as equality: Russell & Norvig (2021, chpt. 7), Poole, Mackworth & Goebel (1998, pp. 268-275), Luger & Stubblefield (2004, pp. 50-62), Nilsson (1998, chpt. 15)\n\n• ^ Logical inference: Russell & Norvig (2021, chpt. 10)\n\n• ^ logical deduction as search: Russell & Norvig (2021, sects. 9.3, 9.4), Poole, Mackworth & Goebel (1998, pp. ~46-52), Luger & Stubblefield (2004, pp. 62-73), Nilsson (1998, chpt. 4.2, 7.2)\n\n• ^ Resolution and unification: Russell & Norvig (2021, sections 7.5.2, 9.2, 9.5)\n\n• ^ Warren, D. H.; Pereira, L. M.; Pereira, F. (1977). \"Prolog-the language and its implementation compared with Lisp\". ACM SIGPLAN Notices. 12 (8): 109-115. doi:10.1145/872734.806939.\n\n• ^ Fuzzy logic: Russell & Norvig (2021, pp. 214, 255, 459), Scientific American (1999)\n\n• ^ a b Stochastic methods for uncertain reasoning: Russell & Norvig (2021, chpt. 12-18, 20), Poole, Mackworth & Goebel (1998, pp. 345-395), Luger & Stubblefield (2004, pp. 165-191, 333-381), Nilsson (1998, chpt. 19)\n\n• ^ decision theory and decision analysis: Russell & Norvig (2021, chpt. 16-18), Poole, Mackworth & Goebel (1998, pp. 381-394)\n\n• ^ Information value theory: Russell & Norvig (2021, sect. 16.6)\n\n• ^ Markov decision processes and dynamic decision networks: Russell & Norvig (2021, chpt. 17)\n\n• ^ a b c Stochastic temporal models: Russell & Norvig (2021, chpt. 14)\nHidden Markov model: Russell & Norvig (2021, sect. 14.3)\nKalman filters: Russell & Norvig (2021, sect. 14.4)\nDynamic Bayesian networks: Russell & Norvig (2021, sect. 14.5)\n\n• ^ Game theory and mechanism design: Russell & Norvig (2021, chpt. 18)\n\n• ^ Bayesian networks: Russell & Norvig (2021, sects. 12.5-12.6, 13.4-13.5, 14.3-14.5, 16.5, 20.2-20.3), Poole, Mackworth & Goebel (1998, pp. 361-381), Luger & Stubblefield (2004, pp. ~182-190, ≈363-379), Nilsson (1998, chpt. 19.3-19.4)\n\n• ^ Domingos (2015), chpt. 6.\n\n• ^ Bayesian inference algorithm: Russell & Norvig (2021, sect. 13.3-13.5), Poole, Mackworth & Goebel (1998, pp. 361-381), Luger & Stubblefield (2004, pp. ~363-379), Nilsson (1998, chpt. 19.4 & 7)\n\n• ^ Domingos (2015), p. 210.\n\n• ^ Bayesian learning and the expectation-maximization algorithm: Russell & Norvig (2021, chpt. 20), Poole, Mackworth & Goebel (1998, pp. 424-433), Nilsson (1998, chpt. 20), Domingos (2015, p. 210)\n\n• ^ Bayesian decision theory and Bayesian decision networks: Russell & Norvig (2021, sect. 16.5)\n\n• ^ Statistical learning methods and classifiers: Russell & Norvig (2021, chpt. 20),\n\n• ^ Ciaramella, Alberto; Ciaramella, Marco (2024). Introduction to Artificial Intelligence: from data analysis to generative AI. Intellisemantic Editions. ISBN 978-8-8947-8760-3.\n\n• ^ Decision trees: Russell & Norvig (2021, sect. 19.3), Domingos (2015, p. 88)\n\n• ^ Non-parameteric learning models such as K-nearest neighbor and support vector machines: Russell & Norvig (2021, sect. 19.7), Domingos (2015, p. 187) (k-nearest neighbor)\n\n• Domingos (2015, p. 88) (kernel methods)\n\n• ^ Domingos (2015), p. 152.\n\n• ^ Naive Bayes classifier: Russell & Norvig (2021, sect. 12.6), Domingos (2015, p. 152)\n\n• ^ a b Neural networks: Russell & Norvig (2021, chpt. 21), Domingos (2015, Chapter 4)\n\n• ^ Gradient calculation in computational graphs, backpropagation, automatic differentiation: Russell & Norvig (2021, sect. 21.2), Luger & Stubblefield (2004, pp. 467-474), Nilsson (1998, chpt. 3.3)\n\n• ^ Universal approximation theorem: Russell & Norvig (2021, p. 752)\nThe theorem: Cybenko (1988), Hornik, Stinchcombe & White (1989)\n\n• ^ Feedforward neural networks: Russell & Norvig (2021, sect. 21.1)\n\n• ^ Perceptrons: Russell & Norvig (2021, pp. 21, 22, 683, 22)\n\n• ^ a b Deep learning: Russell & Norvig (2021, chpt. 21), Goodfellow, Bengio & Courville (2016), Hinton et al. (2016), Schmidhuber (2015)\n\n• ^ Recurrent neural networks: Russell & Norvig (2021, sect. 21.6)\n\n• ^ Convolutional neural networks: Russell & Norvig (2021, sect. 21.3)\n\n• ^ Sindhu V, Nivedha S, Prakash M (February 2020). \"An Empirical Science Research on Bioinformatics in Machine Learning\". Journal of Mechanics of Continua and Mathematical Sciences (7). doi:10.26782/jmcms. spl.7/2020.02.00006.\n\n• ^ Deng & Yu (2014), pp. 199-200.\n\n• ^ Ciresan, Meier & Schmidhuber (2012).\n\n• ^ Russell & Norvig (2021), p. 750.\n\n• ^ a b c Russell & Norvig (2021), p. 17.\n\n• ^ a b c d e f g Russell & Norvig (2021), p. 785.\n\n• ^ a b Schmidhuber (2022), sect. 5.\n\n• ^ Schmidhuber (2022), sect. 6.\n\n• ^ a b c Schmidhuber (2022), sect. 7.\n\n• ^ Schmidhuber (2022), sect. 8.\n\n• ^ Quoted in Christian (2020, p. 22)\n\n• ^ Metz, Cade; Weise, Karen (5 May 2025). \"A. I. Hallucinations Are Getting Worse, Even as New Systems Become More Powerful\". The New York Times. ISSN 0362-4331. Retrieved 6 May 2025.\n\n• ^ Smith (2023).\n\n• ^ \"Explained: Generative AI\". MIT News | Massachusetts Institute of Technology. 9 November 2023.\n\n• ^ \"AI Writing and Content Creation Tools\". MIT Sloan Teaching & Learning Technologies. Archived from the original on 25 December 2023. Retrieved 25 December 2023.\n\n• ^ Marmouyet (2023).\n\n• ^ Kobielus (2019).\n\n• ^ Thomason, James (21 May 2024). \"Mojo Rising: The resurgence of AI-first programming languages\". VentureBeat. Archived from the original on 27 June 2024. Retrieved 26 May 2024.\n\n• ^ Wodecki, Ben (5 May 2023). \"7 AI Programming Languages You Need to Know\". AI Business. Archived from the original on 25 July 2024. Retrieved 5 October 2024.\n\n• ^ Plumb, Taryn (18 September 2024). \"Why Jensen Huang and Marc Benioff see 'gigantic' opportunity for agentic AI\". VentureBeat. Archived from the original on 5 October 2024. Retrieved 4 October 2024.\n\n• ^ Mims, Christopher (19 September 2020). \"Huang's Law Is the New Moore's Law, and Explains Why Nvidia Wants Arm\". Wall Street Journal. ISSN 0099-9660. Archived from the original on 2 October 2023. Retrieved 19 January 2025.\n\n• ^ Dankwa-Mullan, Irene (2024). \"Health Equity and Ethical Considerations in Using Artificial Intelligence in Public Health and Medicine\". Preventing Chronic Disease. 21 240245: E64. doi:10.5888/pcd21.240245. ISSN 1545-1151. PMC 11364282. PMID 39173183.\n\n• ^ Jumper, J; Evans, R; Pritzel, A (2021). \"Highly accurate protein structure prediction with AlphaFold\". Nature. 596 (7873): 583-589. Bibcode:2021Natur.596..583J. doi:10.1038/s41586-021-03819-2. PMC 8371605. PMID 34265844.\n\n• ^ \"AI discovers new class of antibiotics to kill drug-resistant bacteria\". New Scientist. 20 December 2023. Archived from the original on 16 September 2024. Retrieved 5 October 2024.\n\n• ^ \"AI speeds up drug design for Parkinson's ten-fold\". University of Cambridge. Cambridge University. 17 April 2024. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ Horne, Robert I.; Andrzejewska, Ewa A.; Alam, Parvez; Brotzakis, Z. Faidon; Srivastava, Ankit; Aubert, Alice; Nowinska, Magdalena; Gregory, Rebecca C.; Staats, Roxine; Possenti, Andrea; Chia, Sean; Sormanni, Pietro; Ghetti, Bernardino; Caughey, Byron; Knowles, Tuomas P. J.; Vendruscolo, Michele (17 April 2024). \"Discovery of potent inhibitors of α-synuclein aggregation using structure-based iterative learning\". Nature Chemical Biology. 20 (5). Nature: 634-645. doi:10.1038/s41589-024-01580-x. PMC 11062903. PMID 38632492.\n\n• ^ Grant, Eugene F.; Lardner, Rex (25 July 1952). \"The Talk of the Town - It\". The New Yorker. ISSN 0028-792X. Archived from the original on 16 February 2020. Retrieved 28 January 2024.\n\n• ^ Anderson, Mark Robert (11 May 2017). \"Twenty years on from Deep Blue vs Kasparov: how a chess match started the big data revolution\". The Conversation. Archived from the original on 17 September 2024. Retrieved 28 January 2024.\n\n• ^ Markoff, John (16 February 2011). \"Computer Wins on 'Jeopardy!': Trivial, It's Not\". The New York Times. ISSN 0362-4331. Archived from the original on 22 October 2014. Retrieved 28 January 2024.\n\n• ^ Byford, Sam (27 May 2017). \"AlphaGo retires from competitive Go after defeating world number one 3-0\". The Verge. Archived from the original on 7 June 2017. Retrieved 28 January 2024.\n\n• ^ Brown, Noam; Sandholm, Tuomas (30 August 2019). \"Superhuman AI for multiplayer poker\". Science. 365 (6456): 885-890. Bibcode:2019Sci...365..885B. doi:10.1126/science. aay2400. PMID 31296650.\n\n• ^ \"MuZero: Mastering Go, chess, shogi and Atari without rules\". Google DeepMind. 23 December 2020. Retrieved 28 January 2024.\n\n• ^ Sample, Ian (30 October 2019). \"AI becomes grandmaster in 'fiendishly complex' StarCraft II\". The Guardian. ISSN 0261-3077. Archived from the original on 29 December 2020. Retrieved 28 January 2024.\n\n• ^ Wurman, P. R.; Barrett, S.; Kawamoto, K. (2022). \"Outracing champion Gran Turismo drivers with deep reinforcement learning\" (PDF). Nature. 602 (7896): 223-228. Bibcode:2022Natur.602..223W. doi:10.1038/s41586-021-04357-7. PMID 35140384.\n\n• ^ Wilkins, Alex (13 March 2024). \"Google AI learns to play open-world video games by watching them\". New Scientist. Archived from the original on 26 July 2024. Retrieved 21 July 2024.\n\n• ^ Wu, Zhengxuan; Arora, Aryaman; Wang, Zheng; Geiger, Atticus; Jurafsky, Dan; Manning, Christopher D.; Potts, Christopher (2024). \"ReFT: Representation Finetuning for Language Models\". NeurIPS. arXiv:2404.03592.\n\n• ^ \"Improving mathematical reasoning with process supervision\". OpenAI. 31 May 2023. Retrieved 26 January 2025.\n\n• ^ Srivastava, Saurabh (29 February 2024). \"Functional Benchmarks for Robust Evaluation of Reasoning Performance, and the Reasoning Gap\". arXiv:2402.19450 [cs. AI].\n\n• ^ Lightman, Hunter; Kosaraju, Vineet; Burda, Yura; Edwards, Harri; Baker, Bowen; Lee, Teddy; Leike, Jan; Schulman, John; Sutskever, Ilya; Cobbe, Karl (2023). \"Let's Verify Step by Step\". arXiv:2305.20050v1 [cs. LG].\n\n• ^ Franzen, Carl (8 August 2024). \"Alibaba claims no. 1 spot in AI math models with Qwen2-Math\". VentureBeat. Retrieved 16 February 2025.\n\n• ^ Franzen, Carl (9 January 2025). \"Microsoft's new rStar-Math technique upgrades small models to outperform OpenAI's o1-preview at math problems\". VentureBeat. Retrieved 26 January 2025.\n\n• ^ Gina Genkina: New AI Model Advances the \"Kissing Problem\" and More. AlphaEvolve made several mathematical discoveries and practical optimizations IEEE Spectrum 14 May 2025. Retrieved 7 June 2025\n\n• ^ Roberts, Siobhan (25 July 2024). \"AI achieves silver-medal standard solving International Mathematical Olympiad problems\". The New York Times. Archived from the original on 26 September 2024. Retrieved 7 August 2024.\n\n• ^ Azerbayev, Zhangir; Schoelkopf, Hailey; Paster, Keiran; Santos, Marco Dos; McAleer', Stephen; Jiang, Albert Q.; Deng, Jia; Biderman, Stella; Welleck, Sean (16 October 2023). \"Llemma: An Open Language Model For Mathematics\". EleutherAI Blog. Retrieved 26 January 2025.\n\n• ^ \"Julius AI\". julius. ai.\n\n• ^ Metz, Cade (21 July 2025). \"Google A. I. System Wins Gold Medal in International Math Olympiad\". The New York Times. ISSN 0362-4331. Retrieved 24 July 2025.\n\n• ^ McFarland, Alex (12 July 2024). \"8 Best AI for Math Tools (January 2025)\". Unite. AI. Retrieved 26 January 2025.\n\n• ^ Matthew Finio & Amanda Downie: IBM Think 2024 Primer, \"What is Artificial Intelligence (AI) in Finance?\" 8 December 2023\n\n• ^ M. Nicolas, J. Firzli: Pensions Age / European Pensions magazine, \"Artificial Intelligence: Ask the Industry\", May-June 2024. https://videovoice. org/ai-in-finance-innovation-entrepreneurship-vs-over-regulation-with-the-eus-artificial-intelligence-act-wont-work-as-intended/ Archived 11 September 2024 at the Wayback Machine.\n\n• ^ a b c Congressional Research Service (2019). Artificial Intelligence and National Security (PDF). Washington, DC: Congressional Research Service. Archived (PDF) from the original on 8 May 2020. Retrieved 25 February 2024. PD-notice\n\n• ^ a b Slyusar, Vadym (2019). Artificial intelligence as the basis of future control networks (Preprint). doi:10.13140/RG.2.2.30247.50087.\n\n• ^ Iraqi, Amjad (3 April 2024). \"'Lavender': The AI machine directing Israel's bombing spree in Gaza\". +972 Magazine. Archived from the original on 10 October 2024. Retrieved 6 April 2024.\n\n• ^ Davies, Harry; McKernan, Bethan; Sabbagh, Dan (1 December 2023). \"'The Gospel': how Israel uses AI to select bombing targets in Gaza\". The Guardian. Archived from the original on 6 December 2023. Retrieved 4 December 2023.\n\n• ^ Marti, J Werner (10 August 2024). \"Drohnen haben den Krieg in der Ukraine revolutioniert, doch sie sind empfindlich auf Störsender - deshalb sollen sie jetzt autonom operieren\". Neue Zürcher Zeitung (in German). Archived from the original on 10 August 2024. Retrieved 10 August 2024.\n\n• ^ Banh, Leonardo; Strobel, Gero (2023). \"Generative artificial intelligence\". Electronic Markets. 33 (1) 63. doi:10.1007/s12525-023-00680-1.\n\n• ^ Pasick, Adam (27 March 2023). \"Artificial Intelligence Glossary: Neural Networks and Other Terms Explained\". The New York Times. ISSN 0362-4331. Archived from the original on 1 September 2023. Retrieved 22 April 2023.\n\n• ^ Griffith, Erin; Metz, Cade (27 January 2023). \"Anthropic Said to Be Closing In on $300 Million in New A. I. Funding\". The New York Times. Archived from the original on 9 December 2023. Retrieved 14 March 2023.\n\n• ^ Lanxon, Nate; Bass, Dina; Davalos, Jackie (10 March 2023). \"A Cheat Sheet to AI Buzzwords and Their Meanings\". Bloomberg News. Archived from the original on 17 November 2023. Retrieved 14 March 2023.\n\n• ^ Roose, Kevin (21 October 2022). \"A Coming-Out Party for Generative A. I., Silicon Valley's New Craze\". The New York Times. Archived from the original on 15 February 2023. Retrieved 14 March 2023.\n\n• ^ Shahaf, Tal; Shahaf, Tal (23 October 2025). \"Lightricks unveils powerful AI video model challenging OpenAI and Google\". Ynetglobal. Retrieved 22 December 2025.\n\n• ^ Metz, Cade (15 February 2024). \"OpenAI Unveils A. I. That Instantly Generates Eye-Popping Videos\". The New York Times. ISSN 0362-4331. Archived from the original on 15 February 2024. Retrieved 16 February 2024.\n\n• ^ Raza, Marium M.; Venkatesh, Kaushik P.; Kvedar, Joseph C. (7 March 2024). \"Generative AI and large language models in health care: pathways to implementation\". npj Digital Medicine. 7 (1): 62. doi:10.1038/s41746-023-00988-4. ISSN 2398-6352. PMC 10920625. PMID 38454007.\n\n• ^ Mogaji, Emmanuel (7 January 2025). \"How generative AI is transforming financial services - and what it means for customers\". The Conversation. Retrieved 10 April 2025.\n\n• ^ Bean, Thomas H. Davenport and Randy (19 June 2023). \"The Impact of Generative AI on Hollywood and Entertainment\". MIT Sloan Management Review. Archived from the original on 6 August 2024. Retrieved 10 April 2025.\n\n• ^ Brynjolfsson, Erik; Li, Danielle; Raymond, Lindsey R. (April 2023), Generative AI at Work (Working Paper), Working Paper Series, doi:10.3386/w31161, archived from the original on 28 March 2024, retrieved 21 January 2024\n\n• ^ \"Don't fear an AI-induced jobs apocalypse just yet\". The Economist. 6 March 2023. Archived from the original on 17 November 2023. Retrieved 14 March 2023.\n\n• ^ Coyle, Jake (27 September 2023). \"In Hollywood writers' battle against AI, humans win (for now)\". AP News. Associated Press. Archived from the original on 3 April 2024. Retrieved 26 January 2024.\n\n• ^ \"How Generative AI Can Augment Human Creativity\". Harvard Business Review. 16 June 2023. ISSN 0017-8012. Archived from the original on 20 June 2023. Retrieved 20 June 2023.\n\n• ^ Poole, David; Mackworth, Alan (2023). Artificial Intelligence, Foundations of Computational Agents (3rd ed.). Cambridge University Press. doi:10.1017/9781009258227. ISBN 978-1-0092-5819-7.\n\n• ^ Russell, Stuart; Norvig, Peter (2020). Artificial Intelligence: A Modern Approach (4th ed.). Pearson. ISBN 978-0-1346-1099-3.\n\n• ^ \"Why agents are the next frontier of generative AI\". McKinsey Digital. 24 July 2024. Archived from the original on 3 October 2024. Retrieved 10 August 2024.\n\n• ^ \"Introducing Copilot Search in Bing\". blogs. bing. com. 4 April 2025.\n\n• ^ Peters, Jay (14 March 2023). \"The Bing AI bot has been secretly running GPT-4\". The Verge. Retrieved 31 August 2025.\n\n• ^ \"Security for Microsoft 365 Copilot\". learn. microsoft. com.\n\n• ^ O'Flaherty, Kate (21 May 2025). \"Google AI Overviews - Everything You Need To Know\". Forbes.\n\n• ^ \"Generative AI in Search: Let Google do the searching for you\". Google. 14 May 2024.\n\n• ^ Figueiredo, Mayara Costa; Ankrah, Elizabeth; Powell, Jacquelyn E.; Epstein, Daniel A.; Chen, Yunan (12 January 2024). \"Powered by AI: Examining How AI Descriptions Influence Perceptions of Fertility Tracking Applications\". Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies. 7 (4): 1-24. doi:10.1145/3631414.\n\n• ^ Power, Jennifer; Pym, Tinonee; James, Alexandra; Waling, Andrea (5 July 2024). \"Smart Sex Toys: A Narrative Review of Recent Research on Cultural, Health and Safety Considerations\". Current Sexual Health Reports. 16 (3): 199-215. doi:10.1007/s11930-024-00392-3. ISSN 1548-3592.\n\n• ^ Marcantonio, Tiffany L.; Avery, Gracie; Thrash, Anna; Leone, Ruschelle M. (10 September 2024). \"Large Language Models in an App: Conducting a Qualitative Synthetic Data Analysis of How Snapchat's 'My AI' Responds to Questions About Sexual Consent, Sexual Refusals, Sexual Assault, and Sexting\". The Journal of Sex Research. 62 (9): 1905-1919. doi:10.1080/00224499.2024.2396457. PMC 11891083. PMID 39254628.\n\n• ^ Hanson, Kenneth R.; Bolthouse, Hannah (2024). \"\"Replika Removing Erotic Role-Play Is Like Grand Theft Auto Removing Guns or Cars\": Reddit Discourse on Artificial Intelligence Chatbots and Sexual Technologies\". Socius: Sociological Research for a Dynamic World. 10 23780231241259627. doi:10.1177/23780231241259627. ISSN 2378-0231.\n\n• ^ Mania, Karolina (2024). \"Legal Protection of Revenge and Deepfake Porn Victims in the European Union: Findings from a Comparative Legal Study\". Trauma, Violence, & Abuse. 25 (1): 117-129. doi:10.1177/15248380221143772. PMID 36565267.\n\n• ^ Singh, Suyesha; Nambiar, Vaishnavi (2024). \"Role of Artificial Intelligence in the Prevention of Online Child Sexual Abuse: A Systematic Review of Literature\". Journal of Applied Security Research. 19 (4): 586-627. doi:10.1080/19361610.2024.2331885.\n\n• ^ Razi, Afsaneh; Kim, Seunghyun; Alsoubai, Ashwaq; Stringhini, Gianluca; Solorio, Thamar; De Choudhury, Munmun; Wisniewski, Pamela J. (13 October 2021). \"A Human-Centered Systematic Literature Review of the Computational Approaches for Online Sexual Risk Detection\". Proceedings of the ACM on Human-Computer Interaction. 5 (CSCW2): 1-38. doi:10.1145/3479609.\n\n• ^ Ransbotham, Sam; Kiron, David; Gerbert, Philipp; Reeves, Martin (6 September 2017). \"Reshaping Business With Artificial Intelligence\". MIT Sloan Management Review. Archived from the original on 13 February 2024.\n\n• ^ Sun, Yuran; Zhao, Xilei; Lovreglio, Ruggiero; Kuligowski, Erica (2024). \"AI for large-scale evacuation modeling: Promises and challenges\". Interpretable Machine Learning for the Analysis, Design, Assessment, and Informed Decision Making for Civil Infrastructure. pp. 185-204. doi:10.1016/B978-0-12-824073-1.00014-9. ISBN 978-0-12-824073-1.\n\n• ^ Gomaa, Islam; Adelzadeh, Masoud; Gwynne, Steven; Spencer, Bruce; Ko, Yoon; Bénichou, Noureddine; Ma, Chunyun; Elsagan, Nour; Duong, Dana; Zalok, Ehab; Kinateder, Max (1 November 2021). \"A Framework for Intelligent Fire Detection and Evacuation System\". Fire Technology. 57 (6): 3179-3185. doi:10.1007/s10694-021-01157-3.\n\n• ^ Zhao, Xilei; Lovreglio, Ruggiero; Nilsson, Daniel (1 May 2020). \"Modelling and interpreting pre-evacuation decision-making using machine learning\". Automation in Construction. 113 103140. doi:10.1016/j. autcon.2020.103140. hdl:10179/17315.\n\n• ^ \"India's latest election embraced AI technology. Here are some ways it was used constructively\". PBS News. 12 June 2024. Archived from the original on 17 September 2024. Retrieved 28 October 2024.\n\n• ^ \"Экономист Дарон Асемоглу написал книгу об угрозах искусственного интеллекта - и о том, как правильное управление может обратить его на пользу человечеству Спецкор \"Медузы\" Маргарита Лютова узнала у ученого, как скоро мир сможет приблизиться к этой утопии\". Meduza (in Russian). Archived from the original on 20 June 2023. Retrieved 21 June 2023.\n\n• ^ \"Learning, thinking, artistic collaboration and other such human endeavours in the age of AI\". The Hindu. 2 June 2023. Archived from the original on 21 June 2023. Retrieved 21 June 2023.\n\n• ^ Müller, Vincent C. (30 April 2020). \"Ethics of Artificial Intelligence and Robotics\". Stanford Encyclopedia of Philosophy Archive. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ Simonite (2016).\n\n• ^ Russell & Norvig (2021), p. 987.\n\n• ^ \"Assessing potential future artificial intelligence risks, benefits and policy imperatives\". OECD. 14 November 2024. Retrieved 1 August 2025.\n\n• ^ Laskowski (2023).\n\n• ^ GAO (2022).\n\n• ^ Valinsky (2019).\n\n• ^ Russell & Norvig (2021), p. 991.\n\n• ^ Russell & Norvig (2021), pp. 991-992.\n\n• ^ Christian (2020), p. 63.\n\n• ^ Vincent (2022).\n\n• ^ Kopel, Matthew. \"Copyright Services: Fair Use\". Cornell University Library. Archived from the original on 26 September 2024. Retrieved 26 April 2024.\n\n• ^ Burgess, Matt. \"How to Stop Your Data From Being Used to Train AI\". Wired. ISSN 1059-1028. Archived from the original on 3 October 2024. Retrieved 26 April 2024.\n\n• ^ \"Exclusive: Multiple AI companies bypassing web standard to scrape publisher sites, licensing firm says\". Reuters. Archived from the original on 10 November 2024. Retrieved 13 November 2025.\n\n• ^ Shilov, Anton (21 June 2024). \"Several AI companies said to be ignoring robots dot txt exclusion, scraping content without permission: report\". Tom's Hardware. Retrieved 13 November 2025.\n\n• ^ Reisner (2023).\n\n• ^ Alter & Harris (2023).\n\n• ^ \"Getting the Innovation Ecosystem Ready for AI. An IP policy toolkit\" (PDF). WIPO.\n\n• ^ Hammond, George (27 December 2023). \"Big Tech is spending more than VC firms on AI startups\". Ars Technica. Archived from the original on 10 January 2024.\n\n• ^ Wong, Matteo (24 October 2023). \"The Future of AI Is GOMA\". The Atlantic. Archived from the original on 5 January 2024.\n\n• ^ \"Big tech and the pursuit of AI dominance\". The Economist. 26 March 2023. Archived from the original on 29 December 2023.\n\n• ^ Fung, Brian (19 December 2023). \"Where the battle to dominate AI may be won\". CNN Business. Archived from the original on 13 January 2024.\n\n• ^ Metz, Cade (5 July 2023). \"In the Age of A. I., Tech's Little Guys Need Big Friends\". The New York Times. Archived from the original on 8 July 2024. Retrieved 5 October 2024.\n\n• ^ Bhattarai, Abha; Lerman, Rachel (25 December 2025). \"10 charts that show where the economy is heading / 3. AI related investments\". The Washington Post. Archived from the original on 27 December 2025. Source: MSCI\n\n• ^ \"Electricity 2024 - Analysis\". IEA. 24 January 2024. Retrieved 13 July 2024.\n\n• ^ Calvert, Brian (28 March 2024). \"AI already uses as much energy as a small country. It's only the beginning\". Vox. New York, New York. Archived from the original on 3 July 2024. Retrieved 5 October 2024.\n\n• ^ Halper, Evan; O'Donovan, Caroline (21 June 2024). \"AI is exhausting the power grid. Tech firms are seeking a miracle solution\". Washington Post.\n\n• ^ Davenport, Carly. \"AI Data Centers and the Coming YS Power Demand Surge\" (PDF). Goldman Sachs. Archived from the original (PDF) on 26 July 2024. Retrieved 5 October 2024.\n\n• ^ Ryan, Carol (12 April 2024). \"Energy-Guzzling AI Is Also the Future of Energy Savings\". Wall Street Journal. Dow Jones.\n\n• ^ Hiller, Jennifer (1 July 2024). \"Tech Industry Wants to Lock Up Nuclear Power for AI\". Wall Street Journal. Dow Jones. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ Kendall, Tyler (28 September 2024). \"Nvidia's Huang Says Nuclear Power an Option to Feed Data Centers\". Bloomberg.\n\n• ^ Halper, Evan (20 September 2024). \"Microsoft deal would reopen Three Mile Island nuclear plant to power AI\". Washington Post.\n\n• ^ Hiller, Jennifer (20 September 2024). \"Three Mile Island's Nuclear Plant to Reopen, Help Power Microsoft's AI Centers\". Wall Street Journal. Dow Jones. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ a b c Niva Yadav (19 August 2024). \"Taiwan to stop large data centers in the North, cites insufficient power\". DatacenterDynamics. Archived from the original on 8 November 2024. Retrieved 7 November 2024.\n\n• ^ a b Mochizuki, Takashi; Oda, Shoko (18 October 2024). \"エヌビディア出資の日本企業、原発近くでΑIデータセンター新設検討\". Bloomberg (in Japanese). Archived from the original on 8 November 2024. Retrieved 7 November 2024.\n\n• ^ a b Naureen S Malik and Will Wade (5 November 2024). \"Nuclear-Hungry AI Campuses Need New Plan to Find Power Fast\". Bloomberg.\n\n• ^ \"Energy and AI Executive summary\". International Energy Agency. Retrieved 10 April 2025.\n\n• ^ Nicas (2018).\n\n• ^ Rainie, Lee; Keeter, Scott; Perrin, Andrew (22 July 2019). \"Trust and Distrust in America\". Pew Research Center. Archived from the original on 22 February 2024.\n\n• ^ Kosoff, Maya (8 February 2018). \"YouTube Struggles to Contain Its Conspiracy Problem\". Vanity Fair. Retrieved 10 April 2025.\n\n• ^ Berry, David M. (19 March 2025). \"Synthetic media and computational capitalism: towards a critical theory of artificial intelligence\". AI & Society. 40 (7): 5257-5269. doi:10.1007/s00146-025-02265-2. ISSN 1435-5655.\n\n• ^ \"Unreal: A quantum leap in AI video\". The Week. 17 June 2025. Retrieved 20 June 2025.\n\n• ^ Snow, Jackie (16 June 2025). \"AI video is getting real. Beware what comes next\". Quartz. Retrieved 20 June 2025.\n\n• ^ Chow, Andrew R.; Perrigo, Billy (3 June 2025). \"Google's New AI Tool Generates Convincing Deepfakes of Riots, Conflict, and Election Fraud\". Time. Retrieved 20 June 2025.\n\n• ^ Williams (2023).\n\n• ^ Olanipekun, Samson Olufemi (2025). \"Computational propaganda and misinformation: AI technologies as tools of media manipulation\". World Journal of Advanced Research and Reviews. 25 (1): 911-923. doi:10.30574/wjarr.2025.25.1.0131. ISSN 2581-9615.\n\n• ^ Taylor & Hern (2023).\n\n• ^ Lin, Hause; Czarnek, Gabriela; Lewis, Benjamin; White, Joshua P.; Berinsky, Adam J.; Costello, Thomas; Pennycook, Gordon; Rand, David G. (2025). \"Persuading voters using human-artificial intelligence dialogues\". Nature. 648 (8093): 394-401. Bibcode:2025Natur.648..394L. doi:10.1038/s41586-025-09771-9. PMID 41345316.\n\n• ^ \"To fight AI, we need 'personhood credentials,' say AI firms\". Archived from the original on 24 April 2025. Retrieved 9 May 2025.\n\n• ^ a b Samuel, Sigal (19 April 2022). \"Why it's so damn hard to make AI fair and unbiased\". Vox. Archived from the original on 5 October 2024. Retrieved 24 July 2024.\n\n• ^ a b Rose (2023).\n\n• ^ CNA (2019).\n\n• ^ Mazeika, Mantas; Yin, Xuwang; Tamirisa, Rishub; Lim, Jaehyuk; Lee, Bruce W.; Ren, Richard; Phan, Long; Mu, Norman; Khoja, Adam (2025), Utility Engineering: Analyzing and Controlling Emergent Value Systems in AIs, Figure 16, arXiv:2502.08640\n\n• ^ Goffrey (2008), p. 17.\n\n• ^ Berdahl et al. (2023); Goffrey (2008, p. 17); Rose (2023); Russell & Norvig (2021, p. 995)\n\n• ^ Christian (2020), p. 25.\n\n• ^ a b Russell & Norvig (2021), p. 995.\n\n• ^ Grant & Hill (2023).\n\n• ^ Larson & Angwin (2016).\n\n• ^ Christian (2020), p. 67-70.\n\n• ^ Christian (2020, pp. 67-70); Russell & Norvig (2021, pp. 993-994)\n\n• ^ Russell & Norvig (2021, p. 995); Lipartito (2011, p. 36); Goodman & Flaxman (2017, p. 6); Christian (2020, pp. 39-40, 65)\n\n• ^ Quoted in Christian (2020, p. 65).\n\n• ^ Russell & Norvig (2021, p. 994); Christian (2020, pp. 40, 80-81)\n\n• ^ Quoted in Christian (2020, p. 80)\n\n• ^ Hundt, Andrew; Agnew, William; Zeng, Vicky; Kacianka, Severin; Gombolay, Matthew (21-24 June 2022). \"Robots Enact Malignant Stereotypes\". Proceedings of the 2022 ACM Conference on Fairness, Accountability, and Transparency (FAccT '22). Seoul, South Korea: Association for Computing Machinery. doi:10.1145/3531146.3533138.\n\n• ^ For accessible summaries, see the Georgia Tech release and ScienceDaily coverage of the study's findings.\"Flawed AI Makes Robots Racist, Sexist\". Georgia Tech Research News. 23 June 2022.\n\n• ^ \"Robots turn racist and sexist with flawed AI, study finds\". ScienceDaily. 21 June 2022.\n\n• ^ Sample (2017).\n\n• ^ \"Black Box AI\". 16 June 2023. Archived from the original on 15 June 2024. Retrieved 5 October 2024.\n\n• ^ Christian (2020), p. 110.\n\n• ^ Christian (2020), pp. 88-91.\n\n• ^ Christian (2020, p. 83); Russell & Norvig (2021, p. 997)\n\n• ^ Christian (2020), p. 91.\n\n• ^ Christian (2020), p. 83.\n\n• ^ Verma (2021).\n\n• ^ Rothman (2020).\n\n• ^ Christian (2020), pp. 105-108.\n\n• ^ Christian (2020), pp. 108-112.\n\n• ^ Ropek, Lucas (21 May 2024). \"New Anthropic Research Sheds Light on AI's 'Black Box'\". Gizmodo. Archived from the original on 5 October 2024. Retrieved 23 May 2024.\n\n• ^ Russell & Norvig (2021), p. 989.\n\n• ^ a b Russell & Norvig (2021), pp. 987-990.\n\n• ^ Russell & Norvig (2021), p. 988.\n\n• ^ Robitzski (2018); Sainato (2015)\n\n• ^ Harari (2018).\n\n• ^ Buckley, Chris; Mozur, Paul (22 May 2019). \"How China Uses High-Tech Surveillance to Subdue Minorities\". The New York Times. Archived from the original on 25 November 2019. Retrieved 2 July 2019.\n\n• ^ Whittaker, Zack (3 May 2019). \"Security lapse exposed a Chinese smart city surveillance system\". TechCrunch. Archived from the original on 7 March 2021. Retrieved 14 September 2020.\n\n• ^ Urbina et al. (2022).\n\n• ^ a b McGaughey (2022).\n\n• ^ Ford & Colvin (2015); McGaughey (2022)\n\n• ^ IGM Chicago (2017).\n\n• ^ Arntz, Gregory & Zierahn (2016), p. 33.\n\n• ^ Lohr (2017); Frey & Osborne (2017); Arntz, Gregory & Zierahn (2016, p. 33)\n\n• ^ Zhou, Viola (11 April 2023). \"AI is already taking video game illustrators' jobs in China\". Rest of World. Archived from the original on 21 February 2024. Retrieved 17 August 2023.\n\n• ^ Carter, Justin (11 April 2023). \"China's game art industry reportedly decimated by growing AI use\". Game Developer. Archived from the original on 17 August 2023. Retrieved 17 August 2023.\n\n• ^ Morgenstern (2015).\n\n• ^ Mahdawi (2017); Thompson (2014)\n\n• ^ Ma, Jason (5 July 2025). \"Ford CEO Jim Farley warns AI will wipe out half of white-collar jobs, but the 'essential economy' has a huge shortage of workers\". Fortune. Retrieved 21 October 2025.\n\n• ^ Tarnoff, Ben (4 August 2023). \"Lessons from Eliza\". The Guardian Weekly. pp. 34-39.\n\n• ^ Cellan-Jones (2014).\n\n• ^ Russell & Norvig 2021, p. 1001.\n\n• ^ Bostrom (2014).\n\n• ^ Russell (2019).\n\n• ^ Bostrom (2014); Müller & Bostrom (2014); Bostrom (2015).\n\n• ^ Harari (2023).\n\n• ^ Stewart (2025).\n\n• ^ Müller & Bostrom (2014).\n\n• ^ Leaders' concerns about the existential risks of AI around 2015: Rawlinson (2015), Holley (2015), Gibbs (2014), Sainato (2015)\n\n• ^ \"\"Godfather of artificial intelligence\" talks impact and potential of new AI\". CBS News. 25 March 2023. Archived from the original on 28 March 2023. Retrieved 28 March 2023.\n\n• ^ Pittis, Don (4 May 2023). \"Canadian artificial intelligence leader Geoffrey Hinton piles on fears of computer takeover\". CBC. Archived from the original on 7 July 2024. Retrieved 5 October 2024.\n\n• ^ \"'50-50 chance' that AI outsmarts humanity, Geoffrey Hinton says\". Bloomberg BNN. 14 June 2024. Archived from the original on 14 June 2024. Retrieved 6 July 2024.\n\n• ^ Valance (2023).\n\n• ^ Taylor, Josh (7 May 2023). \"Rise of artificial intelligence is inevitable but should not be feared, 'father of AI' says\". The Guardian. Archived from the original on 23 October 2023. Retrieved 26 May 2023.\n\n• ^ Colton, Emma (7 May 2023). \"'Father of AI' says tech fears misplaced: 'You cannot stop it'\". Fox News. Archived from the original on 26 May 2023. Retrieved 26 May 2023.\n\n• ^ Jones, Hessie (23 May 2023). \"Juergen Schmidhuber, Renowned 'Father Of Modern AI,' Says His Life's Work Won't Lead To Dystopia\". Forbes. Archived from the original on 26 May 2023. Retrieved 26 May 2023.\n\n• ^ McMorrow, Ryan (19 December 2023). \"Andrew Ng: 'Do we think the world is better off with more or less intelligence?'\". Financial Times. Archived from the original on 25 January 2024. Retrieved 30 December 2023.\n\n• ^ Will Douglas Heaven (2 May 2023). \"Geoffrey Hinton tells us why he's now scared of the tech he helped build\". MIT Technology Review. Ideas AI. Retrieved 4 January 2026.\n\n• ^ Levy, Steven (22 December 2023). \"How Not to Be Stupid About AI, With Yann LeCun\". Wired. Archived from the original on 28 December 2023. Retrieved 30 December 2023.\n\n• ^ Arguments that AI is not an imminent risk: Brooks (2014), Geist (2015), Madrigal (2015), Lee (2014)\n\n• ^ a b Christian (2020), pp. 67, 73.\n\n• ^ Yudkowsky (2008).\n\n• ^ a b Anderson & Anderson (2011).\n\n• ^ AAAI (2014).\n\n• ^ Wallach (2010).\n\n• ^ Russell (2019), p. 173.\n\n• ^ Stewart, Ashley; Melton, Monica. \"Hugging Face CEO says he's focused on building a 'sustainable model' for the $4.5 billion open-source-AI startup\". Business Insider. Archived from the original on 25 September 2024. Retrieved 14 April 2024.\n\n• ^ Wiggers, Kyle (9 April 2024). \"Google open sources tools to support AI model development\". TechCrunch. Archived from the original on 10 September 2024. Retrieved 14 April 2024.\n\n• ^ Heaven, Will Douglas (12 May 2023). \"The open-source AI boom is built on Big Tech's handouts. How long will it last?\". MIT Technology Review. Retrieved 14 April 2024.\n\n• ^ Brodsky, Sascha (19 December 2023). \"Mistral AI's New Language Model Aims for Open Source Supremacy\". AI Business. Archived from the original on 5 September 2024. Retrieved 5 October 2024.\n\n• ^ Edwards, Benj (22 February 2024). \"Stability announces Stable Diffusion 3, a next-gen AI image generator\". Ars Technica. Archived from the original on 5 October 2024. Retrieved 14 April 2024.\n\n• ^ Marshall, Matt (29 January 2024). \"How enterprises are using open source LLMs: 16 examples\". VentureBeat. Archived from the original on 26 September 2024. Retrieved 5 October 2024.\n\n• ^ Piper, Kelsey (2 February 2024). \"Should we make our most powerful AI models open source to all?\". Vox. Archived from the original on 5 October 2024. Retrieved 14 April 2024.\n\n• ^ Alan Turing Institute (2019). \"Understanding artificial intelligence ethics and safety\" (PDF). Archived (PDF) from the original on 11 September 2024. Retrieved 5 October 2024.\n\n• ^ Alan Turing Institute (2023). \"AI Ethics and Governance in Practice\" (PDF). Archived (PDF) from the original on 11 September 2024. Retrieved 5 October 2024.\n\n• ^ Floridi, Luciano; Cowls, Josh (23 June 2019). \"A Unified Framework of Five Principles for AI in Society\". Harvard Data Science Review. 1 (1). doi:10.1162/99608f92.8cd550d1.\n\n• ^ Buruk, Banu; Ekmekci, Perihan Elif; Arda, Berna (1 September 2020). \"A critical perspective on guidelines for responsible and trustworthy artificial intelligence\". Medicine, Health Care and Philosophy. 23 (3): 387-399. doi:10.1007/s11019-020-09948-1. PMID 32236794.\n\n• ^ Kamila, Manoj Kumar; Jasrotia, Sahil Singh (1 January 2023). \"Ethical issues in the development of artificial intelligence: recognizing the risks\". International Journal of Ethics and Systems. 41 (ahead-of-print): 45-63. doi:10.1108/IJOES-05-2023-0107.\n\n• ^ \"AI Safety Institute releases new AI safety evaluations platform\". UK Government. 10 May 2024. Archived from the original on 5 October 2024. Retrieved 14 May 2024.\n\n• ^ Regulation of AI to mitigate risks: Berryhill et al. (2019), Barfield & Pagallo (2018), Iphofen & Kritikos (2019), Wirtz, Weyerer & Geyer (2018), Buiten (2019)\n\n• ^ Law Library of Congress (U. S.). Global Legal Research Directorate (2019).\n\n• ^ a b Vincent (2023).\n\n• ^ Stanford University (2023).\n\n• ^ a b c d UNESCO (2021).\n\n• ^ Kissinger (2021).\n\n• ^ Altman, Brockman & Sutskever (2023).\n\n• ^ VOA News (25 October 2023). \"UN Announces Advisory Body on Artificial Intelligence\". Voice of America. Archived from the original on 18 September 2024. Retrieved 5 October 2024.\n\n• ^ \"AI Act enters into force - European Commission\". commission. europa. eu. Retrieved 11 August 2025.\n\n• ^ \"Council of Europe opens first ever global treaty on AI for signature\". Council of Europe. 5 September 2024. Archived from the original on 17 September 2024. Retrieved 17 September 2024.\n\n• ^ Edwards (2023).\n\n• ^ Kasperowicz (2023).\n\n• ^ Fox News (2023).\n\n• ^ Milmo, Dan (3 November 2023). \"Hope or Horror? The great AI debate dividing its pioneers\". The Guardian Weekly. pp. 10-12.\n\n• ^ \"The Bletchley Declaration by Countries Attending the AI Safety Summit, 1-2 November 2023\". GOV. UK. 1 November 2023. Archived from the original on 1 November 2023. Retrieved 2 November 2023.\n\n• ^ \"Countries agree to safe and responsible development of frontier AI in landmark Bletchley Declaration\". GOV. UK (Press release). Archived from the original on 1 November 2023. Retrieved 1 November 2023.\n\n• ^ \"Second global AI summit secures safety commitments from companies\". Reuters. 21 May 2024. Retrieved 23 May 2024.\n\n• ^ \"Frontier AI Safety Commitments, AI Seoul Summit 2024\". gov. uk. 21 May 2024. Archived from the original on 23 May 2024. Retrieved 23 May 2024.\n\n• ^ a b Buntz, Brian (3 November 2024). \"Quality vs. quantity: US and China chart different paths in global AI patent race in 2024 / Geographical breakdown of AI patents in 2024\". Research & Development World. R&D World. Archived from the original on 9 December 2024.\n\n• ^ a b Russell & Norvig 2021, p. 9.\n\n• ^ a b c Copeland, J., ed. (2004). The Essential Turing: the ideas that gave birth to the computer age. Oxford, England: Clarendon Press. ISBN 0-1982-5079-7.\n\n• ^ \"Google books ngram\". Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ AI's immediate precursors: McCorduck (2004, pp. 51-107), Crevier (1993, pp. 27-32), Russell & Norvig (2021, pp. 8-17), Moravec (1988, p. 3)\n\n• ^ a b Turing's original publication of the Turing test in \"Computing machinery and intelligence\": Turing (1950)\nHistorical influence and philosophical implications: Haugeland (1985, pp. 6-9), Crevier (1993, p. 24), McCorduck (2004, pp. 70-71), Russell & Norvig (2021, pp. 2, 984)\n\n• ^ Crevier (1993), pp. 47-49.\n\n• ^ Russell & Norvig (2003), p. 17.\n\n• ^ Russell & Norvig (2003), p. 18.\n\n• ^ Newquist (1994), pp. 86-86.\n\n• ^ Simon (1965, p. 96) quoted in Crevier (1993, p. 109)\n\n• ^ Minsky (1967, p. 2) quoted in Crevier (1993, p. 109)\n\n• ^ Russell & Norvig (2021), p. 21.\n\n• ^ Lighthill (1973).\n\n• ^ NRC 1999, pp. 212-213.\n\n• ^ Russell & Norvig (2021), p. 22.\n\n• ^ Expert systems: Russell & Norvig (2021, pp. 23, 292), Luger & Stubblefield (2004, pp. 227-331), Nilsson (1998, chpt. 17.4), McCorduck (2004, pp. 327-335, 434-435), Crevier (1993, pp. 145-162, 197-203), Newquist (1994, pp. 155-183)\n\n• ^ Russell & Norvig (2021), p. 24.\n\n• ^ Nilsson (1998), p. 7.\n\n• ^ McCorduck (2004), pp. 454-462.\n\n• ^ Moravec (1988).\n\n• ^ a b Brooks (1990).\n\n• ^ Developmental robotics: Weng et al. (2001), Lungarella et al. (2003), Asada et al. (2009), Oudeyer (2010)\n\n• ^ Russell & Norvig (2021), p. 25.\n\n• ^ Crevier (1993, pp. 214-215), Russell & Norvig (2021, pp. 24, 26)\n\n• ^ Russell & Norvig (2021), p. 26.\n\n• ^ Formal and narrow methods adopted in the 1990s: Russell & Norvig (2021, pp. 24-26), McCorduck (2004, pp. 486-487)\n\n• ^ AI widely used in the late 1990s: Kurzweil (2005, p. 265), NRC (1999, pp. 216-222), Newquist (1994, pp. 189-201)\n\n• ^ Wong (2023).\n\n• ^ Moore's Law and AI: Russell & Norvig (2021, pp. 14, 27)\n\n• ^ a b c Clark (2015b).\n\n• ^ Big data: Russell & Norvig (2021, p. 26)\n\n• ^ Sagar, Ram (3 June 2020). \"OpenAI Releases GPT-3, The Largest Model So Far\". Analytics India Magazine. Archived from the original on 4 August 2020. Retrieved 15 March 2023.\n\n• ^ Milmo, Dan (2 February 2023). \"ChatGPT reaches 100 million users two months after launch\". The Guardian. ISSN 0261-3077. Archived from the original on 3 February 2023. Retrieved 31 December 2024.\n\n• ^ Gorichanaz, Tim (29 November 2023). \"ChatGPT turns 1: AI chatbot's success says as much about humans as technology\". The Conversation. Archived from the original on 31 December 2024. Retrieved 31 December 2024.\n\n• ^ DiFeliciantonio (2023).\n\n• ^ Goswami (2023).\n\n• ^ \"Nearly 1 in 4 new startups is an AI company\". PitchBook. 24 December 2024. Retrieved 3 January 2025.\n\n• ^ Grayling, Anthony; Ball, Brian (1 August 2024). \"Philosophy is crucial in the age of AI\". The Conversation. Archived from the original on 5 October 2024. Retrieved 4 October 2024.\n\n• ^ a b Jarow, Oshan (15 June 2024). \"Will AI ever become conscious? It depends on how you think about biology\". Vox. Archived from the original on 21 September 2024. Retrieved 4 October 2024.\n\n• ^ McCarthy, John. \"The Philosophy of AI and the AI of Philosophy\". jmc. stanford. edu. Archived from the original on 23 October 2018. Retrieved 3 October 2024.\n\n• ^ a b Turing (1950), p. 1.\n\n• ^ Turing (1950), Under \"The Argument from Consciousness\".\n\n• ^ Kirk-Giannini, Cameron Domenico; Goldstein, Simon (16 October 2023). \"AI is closer than ever to passing the Turing test for 'intelligence'. What happens when it does?\". The Conversation. Archived from the original on 25 September 2024. Retrieved 17 August 2024.\n\n• ^ Russell & Norvig (2021), p. 3.\n\n• ^ Maker (2006).\n\n• ^ McCarthy (1999).\n\n• ^ Minsky (1986).\n\n• ^ Suchman, Lucy (2023). \"The uncontroversial 'thingness' of AI\". Big Data & Society. 10 (2) 20539517231206794. doi:10.1177/20539517231206794.\n\n• ^ Rehak, Rainer (2025). \"AI Narrative Breakdown. A Critical Assessment of Power and Promise\". Proceedings of the 2025 ACM Conference on Fairness, Accountability, and Transparency. pp. 1250-1260. doi:10.1145/3715275.3732083. ISBN 979-8-4007-1482-5.\n\n• ^ Musser, George (1 September 2023). \"How AI Knows Things No One Told It\". Scientific American. Retrieved 17 July 2025.\n\n• ^ \"AI or BS? How to tell if a marketing tool really uses artificial intelligence\". The Drum. Retrieved 31 July 2024.\n\n• ^ Information technology - Artificial intelligence - Artificial intelligence concepts and terminology, BSI British Standards, doi:10.3403/30467396\n\n• ^ \"Regulation - EU - 2024/1689 - EN - EUR-Lex\". eur-lex. europa. eu. Retrieved 30 January 2026.\n\n• ^ Tabassi, Elham (26 January 2023). Artificial Intelligence Risk Management Framework (AI RMF 1.0) (Report). Gaithersburg, MD: National Institute of Standards and Technology (U. S.). doi:10.6028/nist. ai.100-1.\n\n• ^ Nilsson (1983), p. 10.\n\n• ^ Haugeland (1985), pp. 112-117.\n\n• ^ Physical symbol system hypothesis: Newell & Simon (1976, p. 116)\nHistorical significance: McCorduck (2004, p. 153), Russell & Norvig (2021, p. 19)\n\n• ^ Moravec's paradox: Moravec (1988, pp. 15-16), Minsky (1986, p. 29), Pinker (2007, pp. 190-191)\n\n• ^ Dreyfus' critique of AI: Dreyfus (1972), Dreyfus & Dreyfus (1986)\nHistorical significance and philosophical implications: Crevier (1993, pp. 120-132), McCorduck (2004, pp. 211-239), Russell & Norvig (2021, pp. 981-982), Fearn (2007, chpt. 3)\n\n• ^ Crevier (1993), p. 125.\n\n• ^ Langley (2011).\n\n• ^ Katz (2012).\n\n• ^ Neats vs. scruffies, the historic debate: McCorduck (2004, pp. 421-424, 486-489), Crevier (1993, p. 168), Nilsson (1983, pp. 10-11), Russell & Norvig (2021, p. 24)\nA classic example of the \"scruffy\" approach to intelligence: Minsky (1986)\nA modern example of neat AI and its aspirations in the 21st century: Domingos (2015)\n\n• ^ Pennachin & Goertzel (2007).\n\n• ^ a b Roberts (2016).\n\n• ^ Russell & Norvig (2021), p. 986.\n\n• ^ Chalmers (1995).\n\n• ^ Dennett (1991).\n\n• ^ Horst (2005).\n\n• ^ Searle (1999).\n\n• ^ Searle (1980), p. 1.\n\n• ^ Russell & Norvig (2021), p. 9817.\n\n• ^ Searle's Chinese room argument: Searle (1980). Searle's original presentation of the thought experiment., Searle (1999).\nDiscussion: Russell & Norvig (2021, pp. 985), McCorduck (2004, pp. 443-445), Crevier (1993, pp. 269-271)\n\n• ^ Leith, Sam (7 July 2022). \"Nick Bostrom: How can we be certain a machine isn't conscious?\". The Spectator. Archived from the original on 26 September 2024. Retrieved 23 February 2024.\n\n• ^ a b c Thomson, Jonny (31 October 2022). \"Why don't robots have rights?\". Big Think. Archived from the original on 13 September 2024. Retrieved 23 February 2024.\n\n• ^ a b Kateman, Brian (24 July 2023). \"AI Should Be Terrified of Humans\". Time. Archived from the original on 25 September 2024. Retrieved 23 February 2024.\n\n• ^ Wong, Jeff (10 July 2023). \"What leaders need to know about robot rights\". Fast Company.\n\n• ^ Hern, Alex (12 January 2017). \"Give robots 'personhood' status, EU committee argues\". The Guardian. ISSN 0261-3077. Archived from the original on 5 October 2024. Retrieved 23 February 2024.\n\n• ^ Dovey, Dana (14 April 2018). \"Experts Don't Think Robots Should Have Rights\". Newsweek. Archived from the original on 5 October 2024. Retrieved 23 February 2024.\n\n• ^ Cuddy, Alice (13 April 2018). \"Robot rights violate human rights, experts warn EU\". euronews. Archived from the original on 19 September 2024. Retrieved 23 February 2024.\n\n• ^ The Intelligence explosion and technological singularity: Russell & Norvig (2021, pp. 1004-1005), Omohundro (2008), Kurzweil (2005)\n\nI. J. Good's \"intelligence explosion\": Good (1965)\n\nVernor Vinge's \"singularity\": Vinge (1993)\n\n• ^ Russell & Norvig (2021), p. 1005.\n\n• ^ Transhumanism: Moravec (1988), Kurzweil (2005), Russell & Norvig (2021, p. 1005)\n\n• ^ AI as evolution: Edward Fredkin is quoted in McCorduck (2004, p. 401), Butler (1863), Dyson (1998)\n\n• ^ AI in myth: McCorduck (2004, pp. 4-5)\n\n• ^ McCorduck (2004), pp. 340-400.\n\n• ^ Buttazzo (2001).\n\n• ^ Anderson (2008).\n\n• ^ McCauley (2007).\n\n• ^ Galvan (1997).\n\n### Textbooks\n\n• Luger, George; Stubblefield, William (2004). Artificial Intelligence: Structures and Strategies for Complex Problem Solving (5th ed.). Benjamin/Cummings. ISBN 978-0-8053-4780-7. Archived from the original on 26 July 2020. Retrieved 17 December 2019.\n\n• Nilsson, Nils (1998). Artificial Intelligence: A New Synthesis. Morgan Kaufmann. ISBN 978-1-5586-0467-4. Archived from the original on 26 July 2020. Retrieved 18 November 2019.\n\n• Poole, David; Mackworth, Alan; Goebel, Randy (1998). Computational Intelligence: A Logical Approach. New York: Oxford University Press. ISBN 978-0-1951-0270-3. Archived from the original on 26 July 2020. Retrieved 22 August 2020. Later edition: Poole, David; Mackworth, Alan (2017). Artificial Intelligence: Foundations of Computational Agents (2nd ed.). Cambridge University Press. ISBN 978-1-1071-9539-4. Archived from the original on 7 December 2017. Retrieved 6 December 2017.\n\n• Rich, Elaine; Knight, Kevin; Nair, Shivashankar (2010). Artificial Intelligence (3rd ed.). New Delhi: Tata McGraw Hill India. ISBN 978-0-0700-8770-5.\n\n• Russell, Stuart J.; Norvig, Peter (2021). Artificial Intelligence: A Modern Approach (4th ed.). Hoboken: Pearson. ISBN 978-0-1346-1099-3. LCCN 20190474.\n\n• Russell, Stuart J.; Norvig, Peter (2003), Artificial Intelligence: A Modern Approach (2nd ed.), Upper Saddle River, New Jersey: Prentice Hall, ISBN 0-13-790395-2.\n\n### History of AI\n\n• Crevier, Daniel (1993). AI: The Tumultuous Search for Artificial Intelligence. New York, NY: BasicBooks. ISBN 0-465-02997-3.\n\n• McCorduck, Pamela (2004), Machines Who Think (2nd ed.), Natick, Massachusetts: A. K. Peters, ISBN 1-5688-1205-1\n\n• Newquist, H. P. (1994). The Brain Makers: Genius, Ego, And Greed In The Quest For Machines That Think. New York: Macmillan/SAMS. ISBN 978-0-6723-0412-5.\n\n### Other sources\n\n• AI & ML in Fusion\n\n• AI & ML in Fusion, video lecture Archived 2 July 2023 at the Wayback Machine\n\n• Alter, Alexandra; Harris, Elizabeth A. (20 September 2023), \"Franzen, Grisham and Other Prominent Authors Sue OpenAI\", The New York Times, archived from the original on 14 September 2024, retrieved 5 October 2024\n\n• Altman, Sam; Brockman, Greg; Sutskever, Ilya (22 May 2023). \"Governance of Superintelligence\". openai. com. Archived from the original on 27 May 2023. Retrieved 27 May 2023.\n\n• Anderson, Susan Leigh (2008). \"Asimov's 'three laws of robotics' and machine metaethics\". AI & Society. 22 (4): 477-493. doi:10.1007/s00146-007-0094-5.\n\n• Anderson, Michael; Anderson, Susan Leigh (2011). Machine Ethics. Cambridge University Press.\n\n• Arntz, Melanie; Gregory, Terry; Zierahn, Ulrich (2016), \"The risk of automation for jobs in OECD countries: A comparative analysis\", OECD Social, Employment, and Migration Working Papers 189\n\n• Asada, M.; Hosoda, K.; Kuniyoshi, Y.; Ishiguro, H.; Inui, T.; Yoshikawa, Y.; Ogino, M.; Yoshida, C. (2009). \"Cognitive developmental robotics: a survey\". IEEE Transactions on Autonomous Mental Development. 1 (1): 12-34. Bibcode:2009ITAMD...1...12A. doi:10.1109/tamd.2009.2021702.\n\n• \"Ask the AI experts: What's driving today's progress in AI?\". McKinsey & Company. Archived from the original on 13 April 2018. Retrieved 13 April 2018.\n\n• Barfield, Woodrow; Pagallo, Ugo (2018). Research handbook on the law of artificial intelligence. Cheltenham, UK: Edward Elgar Publishing. ISBN 978-1-7864-3904-8. OCLC 1039480085.\n\n• Beal, J.; Winston, Patrick (2009), \"The New Frontier of Human-Level Artificial Intelligence\", IEEE Intelligent Systems, 24 (4): 21-24, Bibcode:2009IISys..24d..21B, doi:10.1109/MIS.2009.75, hdl:1721.1/52357\n\n• Berdahl, Carl Thomas; Baker, Lawrence; Mann, Sean; Osoba, Osonde; Girosi, Federico (7 February 2023). \"Strategies to Improve the Impact of Artificial Intelligence on Health Equity: Scoping Review\". JMIR AI. 2 e42936. doi:10.2196/42936. PMC 11041459. PMID 38875587.\n\n• Berryhill, Jamie; Heang, Kévin Kok; Clogher, Rob; McBride, Keegan (2019). Hello, World: Artificial Intelligence and its Use in the Public Sector (PDF). Paris: OECD Observatory of Public Sector Innovation. Archived (PDF) from the original on 20 December 2019. Retrieved 9 August 2020.\n\n• Bertini, Marco; Del Bimbo, Alberto; Torniai, Carlo (2006). \"Automatic annotation and semantic retrieval of video sequences using multimedia ontologies\". Proceedings of the 14th ACM international conference on Multimedia. pp. 679-682. doi:10.1145/1180639.1180782. ISBN 1-59593-447-2.\n\n• Bostrom, Nick (2014). Superintelligence: Paths, Dangers, Strategies. Oxford University Press.\n\n• Bostrom, Nick (2015). \"What happens when our computers get smarter than we are?\". TED (conference). Archived from the original on 25 July 2020. Retrieved 30 January 2020.\n\n• Brooks, Rodney (10 November 2014). \"artificial intelligence is a tool, not a threat\". Rethink Robotics. Archived from the original on 12 November 2014.\n\n• Brooks, Rodney A. (1990). \"Elephants don't play chess\". Robotics and Autonomous Systems. 6 (1-2): 3-15. doi:10.1016/S0921-8890(05)80025-9.\n\n• Buiten, Miriam C (2019). \"Towards Intelligent Regulation of Artificial Intelligence\". European Journal of Risk Regulation. 10 (1): 41-59. doi:10.1017/err.2019.8. ISSN 1867-299X.\n\n• Bushwick, Sophie (16 March 2023), \"What the New GPT-4 AI Can Do\", Scientific American, archived from the original on 22 August 2023, retrieved 5 October 2024\n\n• Butler, Samuel (13 June 1863). \"Darwin among the Machines\". Letters to the Editor. The Press. Christchurch, New Zealand. Archived from the original on 19 September 2008. Retrieved 16 October 2014 - via Victoria University of Wellington.\n\n• Buttazzo, G. (July 2001). \"Artificial consciousness: Utopia or real possibility?\". Computer. 34 (7): 24-30. Bibcode:2001Compr..34g..24B. doi:10.1109/2.933500.\n\n• Cambria, Erik; White, Bebo (May 2014). \"Jumping NLP Curves: A Review of Natural Language Processing Research [Review Article]\". IEEE Computational Intelligence Magazine. 9 (2): 48-57. doi:10.1109/MCI.2014.2307227.\n\n• Cellan-Jones, Rory (2 December 2014). \"Stephen Hawking warns artificial intelligence could end mankind\". BBC News. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Chalmers, David (1995). \"Facing up to the problem of consciousness\". Journal of Consciousness Studies. 2 (3): 200-219.\n\n• Challa, Subhash; Moreland, Mark R.; Mušicki, Darko; Evans, Robin J. (2011). Fundamentals of Object Tracking. Cambridge University Press. doi:10.1017/CBO9780511975837. ISBN 978-0-5218-7628-5.\n\n• Christian, Brian (2020). The Alignment Problem: Machine learning and human values. W. W. Norton & Company. ISBN 978-0-3938-6833-3. OCLC 1233266753.\n\n• Ciresan, D.; Meier, U.; Schmidhuber, J. (2012). \"Multi-column deep neural networks for image classification\". 2012 IEEE Conference on Computer Vision and Pattern Recognition. pp. 3642-3649. arXiv:1202.2745. doi:10.1109/cvpr.2012.6248110. ISBN 978-1-4673-1228-8.\n\n• Clark, Jack (2015b). \"Why 2015 Was a Breakthrough Year in Artificial Intelligence\". Bloomberg. com. Archived from the original on 23 November 2016. Retrieved 23 November 2016.\n\n• CNA (12 January 2019). \"Commentary: Bad news. Artificial intelligence is biased\". CNA. Archived from the original on 12 January 2019. Retrieved 19 June 2020.\n\n• Cybenko, G. (1988). Continuous valued neural networks with two hidden layers are sufficient (Report). Department of Computer Science, Tufts University.\n\n• Deng, L.; Yu, D. (2014). \"Deep Learning: Methods and Applications\" (PDF). Foundations and Trends in Signal Processing. 7 (3-4): 197-387. doi:10.1561/2000000039. Archived (PDF) from the original on 14 March 2016. Retrieved 18 October 2014.\n\n• Dennett, Daniel (1991). Consciousness Explained. The Penguin Press. ISBN 978-0-7139-9037-9.\n\n• DiFeliciantonio, Chase (3 April 2023). \"AI has already changed the world. This report shows how\". San Francisco Chronicle. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Dickson, Ben (2 May 2022). \"Machine learning: What is the transformer architecture?\". TechTalks. Archived from the original on 22 November 2023. Retrieved 22 November 2023.\n\n• Domingos, Pedro (2015). The Master Algorithm: How the Quest for the Ultimate Learning Machine Will Remake Our World. Basic Books. ISBN 978-0-4650-6570-7.\n\n• Dreyfus, Hubert (1972). What Computers Can't Do. New York: MIT Press. ISBN 978-0-0601-1082-6.\n\n• Dreyfus, Hubert; Dreyfus, Stuart (1986). Mind over Machine: The Power of Human Intuition and Expertise in the Era of the Computer. Oxford: Blackwell. ISBN 978-0-0290-8060-3. Archived from the original on 26 July 2020. Retrieved 22 August 2020.\n\n• Dyson, George (1998). Darwin among the Machines. Allan Lane Science. ISBN 978-0-7382-0030-9. Archived from the original on 26 July 2020. Retrieved 22 August 2020.\n\n• Edelson, Edward (1991). The Nervous System. New York: Chelsea House. ISBN 978-0-7910-0464-7. Archived from the original on 26 July 2020. Retrieved 18 November 2019.\n\n• Edwards, Benj (17 May 2023). \"Poll: AI poses risk to humanity, according to majority of Americans\". Ars Technica. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Fearn, Nicholas (2007). The Latest Answers to the Oldest Questions: A Philosophical Adventure with the World's Greatest Thinkers. New York: Grove Press. ISBN 978-0-8021-1839-4.\n\n• Ford, Martin; Colvin, Geoff (6 September 2015). \"Will robots create more jobs than they destroy?\". The Guardian. Archived from the original on 16 June 2018. Retrieved 13 January 2018.\n\n• Fox News (2023). \"Fox News Poll\" (PDF). Fox News. Archived (PDF) from the original on 12 May 2023. Retrieved 19 June 2023.\n\n• Frey, Carl Benedikt; Osborne, Michael A (2017). \"The future of employment: How susceptible are jobs to computerisation?\". Technological Forecasting and Social Change. 114: 254-280. doi:10.1016/j. techfore.2016.08.019.\n\n• \"From not working to neural networking\". The Economist. 2016. Archived from the original on 31 December 2016. Retrieved 26 April 2018.\n\n• Galvan, Jill (1 January 1997). \"Entering the Posthuman Collective in Philip K. Dick's \"Do Androids Dream of Electric Sheep?\"\". Science Fiction Studies. 24 (3): 413-429. doi:10.1525/sfs.24.3.0413. JSTOR 4240644.\n\n• Geist, Edward Moore (9 August 2015). \"Is artificial intelligence really an existential threat to humanity?\". Bulletin of the Atomic Scientists. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Gibbs, Samuel (27 October 2014). \"Elon Musk: artificial intelligence is our biggest existential threat\". The Guardian. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Goffrey, Andrew (2008). \"Algorithm\". In Fuller, Matthew (ed.). Software studies: a lexicon. Cambridge, Mass.: MIT Press. pp. 15-20. ISBN 978-1-4356-4787-9.\n\n• Goldman, Sharon (14 September 2022). \"10 years later, deep learning 'revolution' rages on, say AI pioneers Hinton, LeCun and Li\". VentureBeat. Archived from the original on 5 October 2024. Retrieved 8 December 2023.\n\n• Good, I. J. (1965), Speculations Concerning the First Ultraintelligent Machine, archived from the original on 10 July 2023, retrieved 5 October 2024\n\n• Goodfellow, Ian; Bengio, Yoshua; Courville, Aaron (2016), Deep Learning, MIT Press., archived from the original on 16 April 2016, retrieved 12 November 2017\n\n• Goodman, Bryce; Flaxman, Seth (2017). \"EU regulations on algorithmic decision-making and a 'right to explanation'\". AI Magazine. 38 (3): 50. arXiv:1606.08813. doi:10.1609/aimag. v38i3.2741.\n\n• Government Accountability Office (13 September 2022). Consumer Data: Increasing Use Poses Risks to Privacy. gao. gov (Report). Archived from the original on 13 September 2024. Retrieved 5 October 2024.\n\n• Grant, Nico; Hill, Kashmir (22 May 2023). \"Google's Photo App Still Can't Find Gorillas. And Neither Can Apple's\". The New York Times. Archived from the original on 14 September 2024. Retrieved 5 October 2024.\n\n• Goswami, Rohan (5 April 2023). \"Here's where the A. I. jobs are\". CNBC. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Harari, Yuval Noah (October 2018). \"Why Technology Favors Tyranny\". The Atlantic. Archived from the original on 25 September 2021. Retrieved 23 September 2021.\n\n• Harari, Yuval Noah (2023). \"AI and the future of humanity\". YouTube. Archived from the original on 30 September 2024. Retrieved 5 October 2024.\n\n• Haugeland, John (1985). Artificial Intelligence: The Very Idea. Cambridge, Mass.: MIT Press. ISBN 978-0-2620-8153-5.\n\n• Hinton, G.; Deng, L.; Yu, D.; Dahl, G.; Mohamed, A.; Jaitly, N.; Senior, A.; Vanhoucke, V.; Nguyen, P.; Sainath, T.; Kingsbury, B. (2012). \"Deep Neural Networks for Acoustic Modeling in Speech Recognition - The shared views of four research groups\". IEEE Signal Processing Magazine. 29 (6): 82-97. Bibcode:2012ISPM...29...82H. doi:10.1109/msp.2012.2205597.\n\n• Holley, Peter (28 January 2015). \"Bill Gates on dangers of artificial intelligence: 'I don't understand why some people are not concerned'\". The Washington Post. ISSN 0190-8286. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Hornik, Kurt; Stinchcombe, Maxwell; White, Halbert (1989). Multilayer Feedforward Networks are Universal Approximators (PDF). Neural Networks. Vol. 2. Pergamon Press. pp. 359-366. Archived (PDF) from the original on 21 April 2023. Retrieved 5 October 2024.\n\n• Horst, Steven (2005). \"The Computational Theory of Mind\". The Stanford Encyclopedia of Philosophy. Archived from the original on 6 March 2016. Retrieved 7 March 2016.\n\n• Howe, J. (November 1994). \"Artificial Intelligence at Edinburgh University: a Perspective\". Archived from the original on 15 May 2007. Retrieved 30 August 2007.\n\n• IGM Chicago (30 June 2017). \"Robots and Artificial Intelligence\". igmchicago. org. Archived from the original on 1 May 2019. Retrieved 3 July 2019.\n\n• Iphofen, Ron; Kritikos, Mihalis (3 January 2019). \"Regulating artificial intelligence and robotics: ethics by design in a digital society\". Contemporary Social Science. 16 (2): 170-184. doi:10.1080/21582041.2018.1563803. ISSN 2158-2041.\n\n• Jordan, M. I.; Mitchell, T. M. (16 July 2015). \"Machine learning: Trends, perspectives, and prospects\". Science. 349 (6245): 255-260. Bibcode:2015Sci...349..255J. doi:10.1126/science. aaa8415. PMID 26185243.\n\n• Kahneman, Daniel; Slovic, Paul; Tversky, Amos (1982). Judgment Under Uncertainty: Heuristics and Biases. Cambridge University Press.\n\n• Kahneman, Daniel (2011). Thinking, Fast and Slow. Macmillan. ISBN 978-1-4299-6935-2. Archived from the original on 15 March 2023. Retrieved 8 April 2012.\n\n• Kasperowicz, Peter (1 May 2023). \"Regulate AI? GOP much more skeptical than Dems that government can do it right: poll\". Fox News. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Katz, Yarden (1 November 2012). \"Noam Chomsky on Where Artificial Intelligence Went Wrong\". The Atlantic. Archived from the original on 28 February 2019. Retrieved 26 October 2014.\n\n• \"Kismet\". MIT Artificial Intelligence Laboratory, Humanoid Robotics Group. Archived from the original on 17 October 2014. Retrieved 25 October 2014.\n\n• Kissinger, Henry (1 November 2021). \"The Challenge of Being Human in the Age of AI\". The Wall Street Journal. Archived from the original on 4 November 2021. Retrieved 4 November 2021.\n\n• Kobielus, James (27 November 2019). \"GPUs Continue to Dominate the AI Accelerator Market for Now\". InformationWeek. Archived from the original on 19 October 2021. Retrieved 11 June 2020.\n\n• Kuperman, G. J.; Reichley, R. M.; Bailey, T. C. (1 July 2006). \"Using Commercial Knowledge Bases for Clinical Decision Support: Opportunities, Hurdles, and Recommendations\". Journal of the American Medical Informatics Association. 13 (4): 369-371. doi:10.1197/jamia. M2055. PMC 1513681. PMID 16622160.\n\n• Kurzweil, Ray (2005). The Singularity is Near. Penguin Books. ISBN 978-0-6700-3384-3.\n\n• Langley, Pat (2011). \"The changing science of machine learning\". Machine Learning. 82 (3): 275-279. doi:10.1007/s10994-011-5242-y.\n\n• Larson, Jeff; Angwin, Julia (23 May 2016). \"How We Analyzed the COMPAS Recidivism Algorithm\". ProPublica. Archived from the original on 29 April 2019. Retrieved 19 June 2020.\n\n• Laskowski, Nicole (November 2023). \"What is Artificial Intelligence and How Does AI Work? TechTarget\". Enterprise AI. Archived from the original on 5 October 2024. Retrieved 30 October 2023.\n\n• Law Library of Congress (U. S.). Global Legal Research Directorate, issuing body. (2019). Regulation of artificial intelligence in selected jurisdictions. LCCN 2019668143. OCLC 1110727808.\n\n• Lee, Timothy B. (22 August 2014). \"Will artificial intelligence destroy humanity? Here are 5 reasons not to worry\". Vox. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Lenat, Douglas; Guha, R. V. (1989). Building Large Knowledge-Based Systems. Addison-Wesley. ISBN 978-0-2015-1752-1.\n\n• Lighthill, James (1973). \"Artificial Intelligence: A General Survey\". Artificial Intelligence: a paper symposium. Science Research Council.\n\n• Lipartito, Kenneth (6 January 2011), The Narrative and the Algorithm: Genres of Credit Reporting from the Nineteenth Century to Today (PDF) (Unpublished manuscript), SSRN 1736283, archived (PDF) from the original on 9 October 2022\n\n• Lohr, Steve (2017). \"Robots Will Take Jobs, but Not as Fast as Some Fear, New Report Says\". The New York Times. Archived from the original on 14 January 2018. Retrieved 13 January 2018.\n\n• Lungarella, M.; Metta, G.; Pfeifer, R.; Sandini, G. (2003). \"Developmental robotics: a survey\". Connection Science. 15 (4): 151-190. Bibcode:2003ConSc..15..151L. doi:10.1080/09540090310001655110.\n\n• \"Machine Ethics\". aaai. org. Archived from the original on 29 November 2014.\n\n• Madrigal, Alexis C. (27 February 2015). \"The case against killer robots, from a guy actually working on artificial intelligence\". Fusion. net. Archived from the original on 4 February 2016. Retrieved 31 January 2016.\n\n• Mahdawi, Arwa (26 June 2017). \"What jobs will still be around in 20 years? Read this to prepare your future\". The Guardian. Archived from the original on 14 January 2018. Retrieved 13 January 2018.\n\n• Maker, Meg Houston (2006), AI@50: AI Past, Present, Future, Dartmouth College, archived from the original on 8 October 2008, retrieved 16 October 2008\n\n• Marmouyet, Françoise (15 December 2023). \"Google's Gemini: is the new AI model really better than ChatGPT?\". The Conversation. Archived from the original on 4 March 2024. Retrieved 25 December 2023.\n\n• Minsky, Marvin (1986), The Society of Mind, Simon and Schuster\n\n• McCarthy, John; Minsky, Marvin; Rochester, Nathan; Shannon, Claude (1955). \"A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence\". stanford. edu. Archived from the original on 26 August 2007. Retrieved 30 August 2007.\n\n• McCarthy, John (2007), \"From Here to Human-Level AI\", Artificial Intelligence, p. 171\n\n• McCarthy, John (1999), What is AI?, archived from the original on 4 December 2022, retrieved 4 December 2022\n\n• McCauley, Lee (2007). \"AI armageddon and the three laws of robotics\". Ethics and Information Technology. 9 (2): 153-164. doi:10.1007/s10676-007-9138-2. ProQuest 222198675.\n\n• McGarry, Ken (1 December 2005). \"A survey of interestingness measures for knowledge discovery\". The Knowledge Engineering Review. 20 (1): 39-61. doi:10.1017/S0269888905000408.\n\n• McGaughey, Ewan (2022). \"Will Robots Automate Your Job Away? Full Employment, Basic Income and Economic Democracy\". Industrial Law Journal. 51 (3): 511-559. doi:10.1093/indlaw/dwab010. SSRN 3044448.\n\n• Merkle, Daniel; Middendorf, Martin (2013). \"Swarm Intelligence\". In Burke, Edmund K.; Kendall, Graham (eds.). Search Methodologies: Introductory Tutorials in Optimization and Decision Support Techniques. Springer Science & Business Media. ISBN 978-1-4614-6940-7.\n\n• Minsky, Marvin (1967), Computation: Finite and Infinite Machines, Englewood Cliffs, N. J.: Prentice-Hall\n\n• Moravec, Hans (1988). Mind Children. Harvard University Press. ISBN 978-0-6745-7616-2. Archived from the original on 26 July 2020. Retrieved 18 November 2019.\n\n• Morgenstern, Michael (9 May 2015). \"Automation and anxiety\". The Economist. Archived from the original on 12 January 2018. Retrieved 13 January 2018.\n\n• Müller, Vincent C.; Bostrom, Nick (2014). \"Future Progress in Artificial Intelligence: A Poll Among Experts\". AI Matters. 1 (1): 9-11. doi:10.1145/2639475.2639478.\n\n• Neumann, Bernd; Möller, Ralf (January 2008). \"On scene interpretation with description logics\". Image and Vision Computing. 26 (1): 82-101. doi:10.1016/j. imavis.2007.08.013.\n\n• Nilsson, Nils (1995), \"Eyes on the Prize\", AI Magazine, vol. 16, pp. 9-17\n\n• Newell, Allen; Simon, H. A. (1976). \"Computer Science as Empirical Inquiry: Symbols and Search\". Communications of the ACM. 19 (3): 113-126. doi:10.1145/360018.360022.\n\n• Nicas, Jack (7 February 2018). \"How YouTube Drives People to the Internet's Darkest Corners\". The Wall Street Journal. ISSN 0099-9660. Archived from the original on 5 October 2024. Retrieved 16 June 2018.\n\n• Nilsson, Nils (1983). \"Artificial Intelligence Prepares for 2001\" (PDF). AI Magazine. 1 (1). Archived (PDF) from the original on 17 August 2020. Retrieved 22 August 2020. Presidential Address to the Association for the Advancement of Artificial Intelligence.\n\n• NRC (United States National Research Council) (1999). \"Developments in Artificial Intelligence\". Funding a Revolution: Government Support for Computing Research. National Academies Press. ISBN 978-0-309-52501-5.\n\n• Omohundro, Steve (2008). The Nature of Self-Improving Artificial Intelligence (PDF). 2007 Singularity Summit. San Francisco, CA.\n\n• Oudeyer, P-Y. (2010). \"On the impact of robotics in behavioral and cognitive sciences: from insect navigation to human cognitive development\". IEEE Transactions on Autonomous Mental Development. 2 (1): 2-16. Bibcode:2010ITAMD...2....2O. doi:10.1109/tamd.2009.2039057.\n\n• Pennachin, C.; Goertzel, B. (2007). \"Contemporary Approaches to Artificial General Intelligence\". Artificial General Intelligence. Cognitive Technologies. Berlin, Heidelberg: Springer. pp. 1-30. doi:10.1007/978-3-540-68677-4_1. ISBN 978-3-5402-3733-4.\n\n• Pinker, Steven (2007) [1994], The Language Instinct, Perennial Modern Classics, Harper, ISBN 978-0-0613-3646-1\n\n• Poria, Soujanya; Cambria, Erik; Bajpai, Rajiv; Hussain, Amir (September 2017). \"A review of affective computing: From unimodal analysis to multimodal fusion\". Information Fusion. 37: 98-125. Bibcode:2017InfFu..37...98P. doi:10.1016/j. inffus.2017.02.003. hdl:1893/25490.\n\n• Rawlinson, Kevin (29 January 2015). \"Microsoft's Bill Gates insists AI is a threat\". BBC News. Archived from the original on 29 January 2015. Retrieved 30 January 2015.\n\n• Reisner, Alex (19 August 2023), \"Revealed: The Authors Whose Pirated Books are Powering Generative AI\", The Atlantic, archived from the original on 3 October 2024, retrieved 5 October 2024\n\n• Roberts, Jacob (2016). \"Thinking Machines: The Search for Artificial Intelligence\". Distillations. Vol. 2, no. 2. pp. 14-23. Archived from the original on 19 August 2018. Retrieved 20 March 2018.\n\n• Robitzski, Dan (5 September 2018). \"Five experts share what scares them the most about AI\". Futurism. Archived from the original on 8 December 2019. Retrieved 8 December 2019.\n\n• Rose, Steve (11 July 2023). \"AI Utopia or dystopia?\". The Guardian Weekly. pp. 42-43.\n\n• Russell, Stuart (2019). Human Compatible: Artificial Intelligence and the Problem of Control. United States: Viking. ISBN 978-0-5255-5861-3. OCLC 1083694322.\n\n• Sainato, Michael (19 August 2015). \"Stephen Hawking, Elon Musk, and Bill Gates Warn About Artificial Intelligence\". Observer. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Sample, Ian (5 November 2017). \"Computer says no: why making AIs fair, accountable and transparent is crucial\". The Guardian. Archived from the original on 10 October 2022. Retrieved 30 January 2018.\n\n• Rothman, Denis (7 October 2020). \"Exploring LIME Explanations and the Mathematics Behind It\". Codemotion. Archived from the original on 25 November 2023. Retrieved 25 November 2023.\n\n• Scassellati, Brian (2002). \"Theory of mind for a humanoid robot\". Autonomous Robots. 12 (1): 13-24. doi:10.1023/A:1013298507114.\n\n• Schmidhuber, J. (2015). \"Deep Learning in Neural Networks: An Overview\". Neural Networks. 61: 85-117. arXiv:1404.7828. Bibcode:2015NN.....61...85S. doi:10.1016/j. neunet.2014.09.003. PMID 25462637.\n\n• Schmidhuber, Jürgen (2022). \"Annotated History of Modern AI and Deep Learning\". Archived from the original on 7 August 2023. Retrieved 5 October 2024.\n\n• Searle, John (1980). \"Minds, Brains and Programs\". Behavioral and Brain Sciences. 3 (3): 417-457. doi:10.1017/S0140525X00005756.\n\n• Searle, John (1999). Mind, language and society. New York: Basic Books. ISBN 978-0-4650-4521-1. OCLC 231867665. Archived from the original on 26 July 2020. Retrieved 22 August 2020.\n\n• Simon, H. A. (1965), The Shape of Automation for Men and Management, New York: Harper & Row, OCLC 1483817127\n\n• Simonite, Tom (31 March 2016). \"How Google Plans to Solve Artificial Intelligence\". MIT Technology Review. Archived from the original on 16 September 2024. Retrieved 5 October 2024.\n\n• Smith, Craig S. (15 March 2023). \"ChatGPT-4 Creator Ilya Sutskever on AI Hallucinations and AI Democracy\". Forbes. Archived from the original on 18 September 2024. Retrieved 25 December 2023.\n\n• Smoliar, Stephen W.; Zhang, HongJiang (1994). \"Content based video indexing and retrieval\". IEEE MultiMedia. 1 (2): 62-72. doi:10.1109/93.311653.\n\n• Solomonoff, Ray (1956). An Inductive Inference Machine (PDF). Dartmouth Summer Research Conference on Artificial Intelligence. Archived (PDF) from the original on 26 April 2011. Retrieved 22 March 2011 - via std. com, pdf scanned copy of the original. Later published as\n\nSolomonoff, Ray (1957). \"An Inductive Inference Machine\". IRE Convention Record. Vol. Section on Information Theory, part 2. pp. 56-62.\n\n• Stanford University (2023). \"Artificial Intelligence Index Report 2023/Chapter 6: Policy and Governance\" (PDF). AI Index. Archived (PDF) from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Stewart, Jon (9 October 2025). \"AI: What Could Go Wrong? With Geoffrey Hinton\". The Weekly Show with Jon Stewart (Podcast).\n\n• Tao, Jianhua; Tan, Tieniu (2005). Affective Computing and Intelligent Interaction. Affective Computing: A Review. Lecture Notes in Computer Science. Vol. 3784. Springer. pp. 981-995. doi:10.1007/11573548. ISBN 978-3-5402-9621-8.\n\n• Taylor, Josh; Hern, Alex (2 May 2023). \"'Godfather of AI' Geoffrey Hinton quits Google and warns over dangers of misinformation\". The Guardian. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• Thompson, Derek (23 January 2014). \"What Jobs Will the Robots Take?\". The Atlantic. Archived from the original on 24 April 2018. Retrieved 24 April 2018.\n\n• Thro, Ellen (1993). Robotics: The Marriage of Computers and Machines. New York: Facts on File. ISBN 978-0-8160-2628-9. Archived from the original on 26 July 2020. Retrieved 22 August 2020.\n\n• Toews, Rob (3 September 2023). \"Transformers Revolutionized AI. What Will Replace Them?\". Forbes. Archived from the original on 8 December 2023. Retrieved 8 December 2023.\n\n• Turing, Alan (October 1950). \"Computing Machinery and Intelligence\". Mind. 59 (236): 433-460. doi:10.1093/mind/LIX.236.433. ISSN 1460-2113. JSTOR 2251299. S2CID 14636783.\n\n• UNESCO Science Report: the Race Against Time for Smarter Development. Paris: UNESCO. 2021. ISBN 978-9-2310-0450-6. Archived from the original on 18 June 2022. Retrieved 18 September 2021.\n\n• Urbina, Fabio; Lentzos, Filippa; Invernizzi, Cédric; Ekins, Sean (7 March 2022). \"Dual use of artificial-intelligence-powered drug discovery\". Nature Machine Intelligence. 4 (3): 189-191. doi:10.1038/s42256-022-00465-9. PMC 9544280. PMID 36211133.\n\n• Valance, Christ (30 May 2023). \"Artificial intelligence could lead to extinction, experts warn\". BBC News. Archived from the original on 17 June 2023. Retrieved 18 June 2023.\n\n• Valinsky, Jordan (11 April 2019), \"Amazon reportedly employs thousands of people to listen to your Alexa conversations\", CNN. com, archived from the original on 26 January 2024, retrieved 5 October 2024\n\n• Verma, Yugesh (25 December 2021). \"A Complete Guide to SHAP - SHAPley Additive exPlanations for Practitioners\". Analytics India Magazine. Archived from the original on 25 November 2023. Retrieved 25 November 2023.\n\n• Vincent, James (7 November 2019). \"OpenAI has published the text-generating AI it said was too dangerous to share\". The Verge. Archived from the original on 11 June 2020. Retrieved 11 June 2020.\n\n• Vincent, James (15 November 2022). \"The scary truth about AI copyright is nobody knows what will happen next\". The Verge. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Vincent, James (3 April 2023). \"AI is entering an era of corporate control\". The Verge. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Vinge, Vernor (1993). \"The Coming Technological Singularity: How to Survive in the Post-Human Era\". Vision 21: Interdisciplinary Science and Engineering in the Era of Cyberspace: 11. Bibcode:1993vise. nasa...11V. Archived from the original on 1 January 2007. Retrieved 14 November 2011.\n\n• Waddell, Kaveh (2018). \"Chatbots Have Entered the Uncanny Valley\". The Atlantic. Archived from the original on 24 April 2018. Retrieved 24 April 2018.\n\n• Wallach, Wendell (2010). Moral Machines. Oxford University Press.\n\n• Wason, P. C.; Shapiro, D. (1966). \"Reasoning\". In Foss, B. M. (ed.). New horizons in psychology. Harmondsworth: Penguin. Archived from the original on 26 July 2020. Retrieved 18 November 2019.\n\n• Weng, J.; McClelland; Pentland, A.; Sporns, O.; Stockman, I.; Sur, M.; Thelen, E. (2001). \"Autonomous mental development by robots and animals\". Science. 291 (5504): 599-600. doi:10.1126/science.291.5504.599. PMID 11229402.\n\n• \"What is 'fuzzy logic'? Are there computers that are inherently fuzzy and do not apply the usual binary logic?\". Scientific American. 21 October 1999. Archived from the original on 6 May 2018. Retrieved 5 May 2018.\n\n• Williams, Rhiannon (28 June 2023), \"Humans may be more likely to believe disinformation generated by AI\", MIT Technology Review, archived from the original on 16 September 2024, retrieved 5 October 2024\n\n• Wirtz, Bernd W.; Weyerer, Jan C.; Geyer, Carolin (24 July 2018). \"Artificial Intelligence and the Public Sector - Applications and Challenges\". International Journal of Public Administration. 42 (7): 596-615. doi:10.1080/01900692.2018.1498103.\n\n• Wong, Matteo (19 May 2023), \"ChatGPT Is Already Obsolete\", The Atlantic, archived from the original on 18 September 2024, retrieved 5 October 2024\n\n• Yudkowsky, E (2008), \"Artificial Intelligence as a Positive and Negative Factor in Global Risk\" (PDF), Global Catastrophic Risks, Oxford University Press, 2008, Bibcode:2008gcr.. book..303Y, archived (PDF) from the original on 19 October 2013, retrieved 24 September 2021\n\n## External links\n\nArtificial intelligence at Wikipedia's sister projects\n\n• Definitions from Wiktionary\n\n• Media from Commons\n\n• Quotations from Wikiquote\n\n• Textbooks from Wikibooks\n\n• Resources from Wikiversity\n\n• Data from Wikidata\n\nScholia has a topic profile for Artificial intelligence.\n\n• Hauser, Larry. \"Artificial Intelligence\". In Fieser, James; Dowden, Bradley (eds.). Internet Encyclopedia of Philosophy. ISSN 2161-0002. OCLC 37741658.\n\n• v\n\n• t\n\n• e\n\nArtificial intelligence (AI)\n\n• History\n\n• timeline\n\n• Glossary\n\n• Companies\n\n• Projects\n\nConcepts\n\n• Parameter\n\n• Hyperparameter\n\n• Loss functions\n\n• Regression\n\n• Bias-variance tradeoff\n\n• Double descent\n\n• Overfitting\n\n• Clustering\n\n• Gradient descent\n\n• SGD\n\n• Quasi-Newton method\n\n• Conjugate gradient method\n\n• Backpropagation\n\n• Attention\n\n• Convolution\n\n• Normalization\n\n• Batchnorm\n\n• Activation\n\n• Softmax\n\n• Sigmoid\n\n• Rectifier\n\n• Gating\n\n• Weight initialization\n\n• Regularization\n\n• Datasets\n\n• Augmentation\n\n• Prompt engineering\n\n• Reinforcement learning\n\n• Q-learning\n\n• SARSA\n\n• Imitation\n\n• Policy gradient\n\n• Diffusion\n\n• Latent diffusion model\n\n• Autoregression\n\n• Adversary\n\n• RAG\n\n• Uncanny valley\n\n• RLHF\n\n• Self-supervised learning\n\n• Reflection\n\n• Recursive self-improvement\n\n• Hallucination\n\n• Word embedding\n\n• Vibe coding\n\n• Safety (Alignment)\n\nApplications\n\n• Machine learning\n\n• In-context learning\n\n• Artificial neural network\n\n• Deep learning\n\n• Language model\n\n• Large\n\n• NMT\n\n• Reasoning\n\n• Model Context Protocol\n\n• Intelligent agent\n\n• Artificial human companion\n\n• Humanity's Last Exam\n\n• Lethal autonomous weapons (LAWs)\n\n• Generative artificial intelligence (GenAI)\n\n• (Hypothetical: Artificial general intelligence (AGI))\n\n• (Hypothetical: Artificial superintelligence (ASI))\n\nImplementations\n\nAudio-visual\n\n• AlexNet\n\n• WaveNet\n\n• Human image synthesis\n\n• HWR\n\n• OCR\n\n• Computer vision\n\n• Speech synthesis\n\n• 15. ai\n\n• ElevenLabs\n\n• Speech recognition\n\n• Whisper\n\n• Facial recognition\n\n• AlphaFold\n\n• Text-to-image models\n\n• Aurora\n\n• DALL-E\n\n• Firefly\n\n• Flux\n\n• GPT Image\n\n• Ideogram\n\n• Imagen\n\n• Midjourney\n\n• Recraft\n\n• Stable Diffusion\n\n• Text-to-video models\n\n• Dream Machine\n\n• Runway Gen\n\n• Hailuo AI\n\n• Kling\n\n• Sora\n\n• Veo\n\n• Music generation\n\n• Riffusion\n\n• Suno AI\n\n• Udio\n\nText\n\n• Word2vec\n\n• Seq2seq\n\n• GloVe\n\n• BERT\n\n• T5\n\n• Llama\n\n• Chinchilla AI\n\n• PaLM\n\n• GPT\n\n• 1\n\n• 2\n\n• 3\n\n• J\n\n• ChatGPT\n\n• 4\n\n• 4o\n\n• o1\n\n• o3\n\n• 4.5\n\n• 4.1\n\n• o4-mini\n\n• 5\n\n• 5.1\n\n• 5.2\n\n• Claude\n\n• Gemini\n\n• Gemini (language model)\n\n• Gemma\n\n• Grok\n\n• LaMDA\n\n• BLOOM\n\n• DBRX\n\n• Project Debater\n\n• IBM Watson\n\n• IBM Watsonx\n\n• Granite\n\n• PanGu-Σ\n\n• DeepSeek\n\n• Qwen\n\nDecisional\n\n• AlphaGo\n\n• AlphaZero\n\n• OpenAI Five\n\n• Self-driving car\n\n• MuZero\n\n• Action selection\n\n• AutoGPT\n\n• Robot control\n\nPeople\n\n• Alan Turing\n\n• Warren Sturgis McCulloch\n\n• Walter Pitts\n\n• John von Neumann\n\n• Christopher D. Manning\n\n• Claude Shannon\n\n• Shun'ichi Amari\n\n• Kunihiko Fukushima\n\n• Takeo Kanade\n\n• Marvin Minsky\n\n• John McCarthy\n\n• Nathaniel Rochester\n\n• Allen Newell\n\n• Cliff Shaw\n\n• Herbert A. Simon\n\n• Oliver Selfridge\n\n• Frank Rosenblatt\n\n• Bernard Widrow\n\n• Joseph Weizenbaum\n\n• Seymour Papert\n\n• Seppo Linnainmaa\n\n• Paul Werbos\n\n• Geoffrey Hinton\n\n• John Hopfield\n\n• Jürgen Schmidhuber\n\n• Yann LeCun\n\n• Yoshua Bengio\n\n• Lotfi A. Zadeh\n\n• Stephen Grossberg\n\n• Alex Graves\n\n• James Goodnight\n\n• Andrew Ng\n\n• Fei-Fei Li\n\n• Alex Krizhevsky\n\n• Ilya Sutskever\n\n• Oriol Vinyals\n\n• Quoc V. Le\n\n• Ian Goodfellow\n\n• Demis Hassabis\n\n• David Silver\n\n• Andrej Karpathy\n\n• Ashish Vaswani\n\n• Noam Shazeer\n\n• Aidan Gomez\n\n• John Schulman\n\n• Mustafa Suleyman\n\n• Jan Leike\n\n• Daniel Kokotajlo\n\n• François Chollet\n\nArchitectures\n\n• Neural Turing machine\n\n• Differentiable neural computer\n\n• Transformer\n\n• Vision transformer (ViT)\n\n• Recurrent neural network (RNN)\n\n• Long short-term memory (LSTM)\n\n• Gated recurrent unit (GRU)\n\n• Echo state network\n\n• Multilayer perceptron (MLP)\n\n• Convolutional neural network (CNN)\n\n• Residual neural network (RNN)\n\n• Highway network\n\n• Mamba\n\n• Autoencoder\n\n• Variational autoencoder (VAE)\n\n• Generative adversarial network (GAN)\n\n• Graph neural network (GNN)\n\nPolitical\n\n• Regulation of artificial intelligence\n\n• Ethics of artificial intelligence\n\n• Precautionary principle\n\n• AI alignment\n\n• EU Artificial Intelligence Act (AI Act)\n\nSocial and economic\n\n• AI boom\n\n• AI bubble\n\n• AI literacy\n\n• AI winter\n\n• In education\n\n• In architecture\n\n• In visual art\n\n• Category\n\nArticles related to artificial intelligence\n\n• v\n\n• t\n\n• e\n\nJohn McCarthy\n\n• Artificial intelligence\n\n• Circumscription\n\n• Dartmouth workshop\n\n• Frame problem\n\n• Garbage collection\n\n• Lisp\n\n• ALGOL 60\n\n• McCarthy evaluation\n\n• McCarthy Formalism\n\n• McCarthy 91 function\n\n• Situation calculus\n\n• Space fountain\n\n• v\n\n• t\n\n• e\n\nPhilosophy of mind\n\nPhilosophers\n\n• G. E. M. Anscombe\n\n• Aristotle\n\n• Armstrong\n\n• Thomas Aquinas\n\n• J. L. Austin\n\n• Alexander Bain\n\n• George Berkeley\n\n• Henri Bergson\n\n• Ned Block\n\n• Franz Brentano\n\n• C. D. Broad\n\n• Tyler Burge\n\n• David Chalmers\n\n• Patricia Churchland\n\n• Paul Churchland\n\n• Andy Clark\n\n• Dharmakirti\n\n• Donald Davidson\n\n• Daniel Dennett\n\n• René Descartes\n\n• Fred Dretske\n\n• Fodor\n\n• Goldman\n\n• Martin Heidegger\n\n• David Hume\n\n• Edmund Husserl\n\n• William James\n\n• Frank Cameron Jackson\n\n• Immanuel Kant\n\n• David Lewis (philosopher)\n\n• John Locke\n\n• Gottfried Wilhelm Leibniz\n\n• Maurice Merleau-Ponty\n\n• Marvin Minsky\n\n• Thomas Nagel\n\n• Alva Noë\n\n• Derek Parfit\n\n• Plato\n\n• Hilary Putnam\n\n• Richard Rorty\n\n• Gilbert Ryle\n\n• John Searle\n\n• Wilfrid Sellars\n\n• Baruch Spinoza\n\n• Alan Turing\n\n• Michael Tye\n\n• Vasubandhu\n\n• Ludwig Wittgenstein\n\n• Stephen Yablo\n\n• Zhuangzi\n\n• more...\n\nTheories\n\n• Behaviorism\n\n• Biological naturalism\n\n• Dualism\n\n• Eliminative materialism\n\n• Emergent materialism\n\n• Epiphenomenalism\n\n• Functionalism\n\n• Interactionism\n\n• Naïve realism\n\n• Neurophenomenology\n\n• Neutral monism\n\n• New mysterianism\n\n• Nondualism\n\n• Occasionalism\n\n• Parallelism\n\n• Phenomenalism\n\n• Phenomenology\n\n• Physicalism\n\n• Type physicalism\n\n• Property dualism\n\n• Representational\n\n• Solipsism\n\n• Substance dualism\n\nConcepts\n\n• Abstract object\n\n• Animal machine\n\n• Chinese room\n\n• Creativity\n\n• Cognition\n\n• Cognitive closure\n\n• Concept\n\n• Consciousness\n\n• Hard problem of consciousness\n\n• Hypostatic abstraction\n\n• Idea\n\n• Identity\n\n• Intelligence\n\n• Artificial\n\n• Human\n\n• Intentionality\n\n• Introspection\n\n• Intuition\n\n• Language of thought\n\n• Mental event\n\n• Mental image\n\n• Mental process\n\n• Mental property\n\n• Mental representation\n\n• Mind\n\n• Mind-body problem\n\n• Pain\n\n• Problem of other minds\n\n• Propositional attitude\n\n• Qualia\n\n• Tabula rasa\n\n• Understanding\n\n• Zombie\n\nRelated\n\n• Metaphysics\n\n• Philosophy of artificial intelligence / information / perception / self\n\n• Category\n\n• Philosophers category\n\n• Project\n\n• Task Force\n\n• v\n\n• t\n\n• e\n\nPhilosophy of science\n\nConcepts\n\n• Analysis\n\n• Analytic-synthetic distinction\n\n• A priori and a posteriori\n\n• Causality\n\n• Mill's Methods\n\n• Commensurability\n\n• Consilience\n\n• Construct\n\n• Correlation\n\n• function\n\n• Creative synthesis\n\n• Demarcation problem\n\n• Empirical evidence\n\n• Experiment\n\n• design\n\n• Thought\n\n• Explanatory power\n\n• Fact\n\n• Falsifiability\n\n• Feminist method\n\n• Functional contextualism\n\n• Hypothesis\n\n• alternative\n\n• null\n\n• Ignoramus et ignorabimus\n\n• Inductive reasoning\n\n• Intertheoretic reduction\n\n• Inquiry\n\n• Measurement\n\n• Nature\n\n• Objectivity\n\n• Observation\n\n• Paradigm\n\n• Problem of induction\n\n• Research\n\n• Scientific evidence\n\n• Evidence-based practice\n\n• Scientific law\n\n• Scientific method\n\n• Scientific pluralism\n\n• Scientific Revolution\n\n• Testability\n\n• Theory\n\n• choice\n\n• ladenness\n\n• scientific\n\n• Underdetermination\n\n• Unity of science\n\n• Variable\n\n• control\n\n• dependent and independent\n\nTheories\n\n• Coherentism\n\n• Confirmation holism\n\n• Constructive empiricism\n\n• Constructive realism\n\n• Constructivist epistemology\n\n• Contextualism\n\n• Conventionalism\n\n• Deductive-nomological model\n\n• Epistemological anarchism\n\n• Evolutionism\n\n• Fallibilism\n\n• Foundationalism\n\n• Hypothetico-deductive model\n\n• Inductionism\n\n• Instrumentalism\n\n• Model-dependent realism\n\n• Naturalism\n\n• Physicalism\n\n• Positivism / Reductionism / Determinism\n\n• Pragmatism\n\n• Rationalism / Empiricism\n\n• Received view / Semantic view of theories\n\n• Scientific essentialism\n\n• Scientific formalism\n\n• Scientific realism / Anti-realism\n\n• Scientific skepticism\n\n• Scientism\n\n• Structuralism\n\n• Uniformitarianism\n\n• Verificationism\n\n• Vitalism\n\nPhilosophy of...\n\n• Biology\n\n• Chemistry\n\n• Physics\n\n• Space and time\n\n• Social science\n\n• Archaeology\n\n• Economics\n\n• Geography\n\n• History\n\n• Linguistics\n\n• Psychology\n\nRelated topics\n\n• Criticism of science\n\n• Descriptive science\n\n• Epistemology\n\n• Exact sciences\n\n• Faith and rationality\n\n• Hard and soft science\n\n• History and philosophy of science\n\n• Non-science\n\n• Pseudoscience\n\n• Normative science\n\n• Protoscience\n\n• Questionable cause\n\n• Relationship between religion and science\n\n• Rhetoric of science\n\n• Science studies\n\n• Sociology of scientific ignorance\n\n• Sociology of scientific knowledge\n\nPhilosophers of science\n\nPrecursors\n\n• Roger Bacon\n\n• Francis Bacon\n\n• Galileo Galilei\n\n• Isaac Newton\n\n• David Hume\n\n• Auguste Comte\n\n• Henri Poincaré\n\n• Pierre Duhem\n\n• Rudolf Steiner\n\n• Karl Pearson\n\n• Charles Sanders Peirce\n\n• Wilhelm Windelband\n\n• Alfred North Whitehead\n\n• Bertrand Russell\n\n• Otto Neurath\n\n• C. D. Broad\n\n• Michael Polanyi\n\n• Hans Reichenbach\n\n• Rudolf Carnap\n\n• Karl Popper\n\n• Carl Gustav Hempel\n\n• W. V. O. Quine\n\n• Thomas Kuhn\n\n• Imre Lakatos\n\n• Paul Feyerabend\n\n• Ian Hacking\n\n• Bas van Fraassen\n\n• Larry Laudan\n\n• Category\n\n• Philosophy portal\n\n• Science portal\n\n• v\n\n• t\n\n• e\n\nEvolutionary computation\n\nMain Topics\n\n• Evolutionary algorithm\n\n• Evolutionary data mining\n\n• Evolutionary multimodal optimization\n\n• Human-based evolutionary computation\n\n• Interactive evolutionary computation\n\nAlgorithms\n\n• Cellular evolutionary algorithm\n\n• Covariance Matrix Adaptation Evolution Strategy (CMA-ES)\n\n• Cultural algorithm\n\n• Differential evolution\n\n• Evolutionary programming\n\n• Genetic algorithm\n\n• Genetic programming\n\n• Gene expression programming\n\n• Evolution strategy\n\n• Natural evolution strategy\n\n• Neuroevolution\n\n• Learning classifier system\n\nRelated techniques\n\n• Swarm intelligence\n\n• Ant colony optimization\n\n• Bees algorithm\n\n• Cuckoo search\n\n• Particle swarm optimization\n\n• Bacterial Colony Optimization\n\nMetaheuristic methods\n\n• Firefly algorithm\n\n• Harmony search\n\n• Gaussian adaptation\n\n• Memetic algorithm\n\nRelated topics\n\n• Artificial development\n\n• Artificial intelligence\n\n• Artificial life\n\n• Digital organism\n\n• Evolutionary robotics\n\n• Fitness function\n\n• Fitness landscape\n\n• Fitness approximation\n\n• Genetic operators\n\n• Interactive evolutionary computation\n\n• No free lunch in search and optimization\n\n• Machine learning\n\n• Mating pool\n\n• Premature convergence\n\n• Program synthesis\n\nOrganizations\n\n• ACM\n\n• IEEE\n\n• ACM SIGEVO\n\n• IEEE CIS\n\nConferences\n\n• CEC\n\n• GECCO\n\n• PPSN\n\n• EvoStar\n\n• FOGA\n\nJournals\n\n• Evolutionary Computation (journal)\n\n• IEEE Trans Evol Comput\n\n• ACM Trans Evol Learning Optim\n\n• v\n\n• t\n\n• e\n\nComputer science\n\nNote: This template roughly follows the 2012 ACM Computing Classification System.\n\nHardware\n\n• Printed circuit board\n\n• Peripheral\n\n• Integrated circuit\n\n• Very-large-scale integration\n\n• System on a chip (SoC)\n\n• Energy consumption (green computing)\n\n• Electronic design automation\n\n• Hardware acceleration\n\n• Processor\n\n• Size / Form\n\nComputer systems organization\n\n• Computer architecture\n\n• Computational complexity\n\n• Dependability\n\n• Embedded system\n\n• Real-time computing\n\n• Cyber-physical system\n\n• Fault tolerance\n\n• Wireless sensor network\n\nNetworks\n\n• Network architecture\n\n• Network protocol\n\n• Network components\n\n• Network scheduler\n\n• Network performance evaluation\n\n• Network service\n\nSoftware organization\n\n• Interpreter\n\n• Middleware\n\n• Virtual machine\n\n• Operating system\n\n• Software quality\n\nSoftware notations and tools\n\n• Programming paradigm\n\n• Programming language\n\n• Compiler\n\n• Domain-specific language\n\n• Modeling language\n\n• Software framework\n\n• Integrated development environment\n\n• Software configuration management\n\n• Software library\n\n• Software repository\n\nSoftware development\n\n• Control flow\n\n• Software development process\n\n• Requirements analysis\n\n• Software design\n\n• Software construction\n\n• Software deployment\n\n• Software engineering\n\n• Software maintenance\n\n• Programming team\n\n• Open-source model\n\nTheory of computation\n\n• Model of computation\n\n• Stochastic\n\n• Formal language\n\n• Automata theory\n\n• Computability theory\n\n• Computational complexity theory\n\n• Logic\n\n• Semantics\n\nAlgorithms\n\n• Algorithm design\n\n• Analysis of algorithms\n\n• Algorithmic efficiency\n\n• Randomized algorithm\n\n• Computational geometry\n\nMathematics of computing\n\n• Discrete mathematics\n\n• Probability\n\n• Statistics\n\n• Mathematical software\n\n• Information theory\n\n• Mathematical analysis\n\n• Numerical analysis\n\n• Theoretical computer science\n\n• Computational problem\n\nInformation systems\n\n• Database management system\n\n• Information storage systems\n\n• Enterprise information system\n\n• Social information systems\n\n• Geographic information system\n\n• Decision support system\n\n• Process control system\n\n• Multimedia information system\n\n• Data mining\n\n• Digital library\n\n• Computing platform\n\n• Digital marketing\n\n• World Wide Web\n\n• Information retrieval\n\nSecurity\n\n• Cryptography\n\n• Formal methods\n\n• Security hacker\n\n• Security services\n\n• Intrusion detection system\n\n• Hardware security\n\n• Network security\n\n• Information security\n\n• Application security\n\nHuman-centered computing\n\n• Interaction design\n\n• Augmented reality\n\n• Virtual reality\n\n• Social computing\n\n• Ubiquitous computing\n\n• Visualization\n\n• Accessibility\n\n• Human-computer interaction\n\n• Mobile computing\n\nConcurrency\n\n• Concurrent computing\n\n• Parallel computing\n\n• Distributed computing\n\n• Multithreading\n\n• Multiprocessing\n\nArtificial intelligence\n\n• Natural language processing\n\n• Knowledge representation and reasoning\n\n• Computer vision\n\n• Automated planning and scheduling\n\n• Search methodology\n\n• Control method\n\n• Philosophy of artificial intelligence\n\n• Distributed artificial intelligence\n\nMachine learning\n\n• Supervised learning\n\n• Unsupervised learning\n\n• Reinforcement learning\n\n• Multi-task learning\n\n• Cross-validation\n\nGraphics\n\n• Animation\n\n• Rendering\n\n• Photograph manipulation\n\n• Graphics processing unit\n\n• Image compression\n\n• Solid modeling\n\nApplied computing\n\n• Quantum computing\n\n• E-commerce\n\n• Enterprise software\n\n• Computational mathematics\n\n• Computational physics\n\n• Computational chemistry\n\n• Computational biology\n\n• Computational social science\n\n• Computational engineering\n\n• Differentiable computing\n\n• Computational healthcare\n\n• Digital art\n\n• Electronic publishing\n\n• Cyberwarfare\n\n• Electronic voting\n\n• Video games\n\n• Word processing\n\n• Operations research\n\n• Educational technology\n\n• Document management\n\nSpecialized Platform\nDevelopment\n\n• Thermodynamic computing\n\n• Category\n\n• Outline\n\n• Glossaries\n\n• v\n\n• t\n\n• e\n\nEmerging technologies\n\nFields\n\nInformation andcommunications\n\n• Ambient intelligence\n\n• Internet of things\n\n• Artificial intelligence\n\n• Applications of artificial intelligence\n\n• Machine translation\n\n• Machine vision\n\n• Mobile translation\n\n• Progress in artificial intelligence\n\n• Semantic Web\n\n• Speech recognition\n\n• Atomtronics\n\n• Carbon nanotube field-effect transistor\n\n• Cybermethodology\n\n• Augmented reality\n\n• Fourth-generation optical discs\n\n• 3D optical data storage\n\n• Holographic data storage\n\n• GPGPU\n\n• Memory\n\n• CBRAM\n\n• ECRAM\n\n• FRAM\n\n• Millipede\n\n• MRAM\n\n• NRAM\n\n• PRAM\n\n• Racetrack memory\n\n• RRAM\n\n• SONOS\n\n• UltraRAM\n\n• Optical computing\n\n• RFID\n\n• Chipless RFID\n\n• Software-defined radio\n\n• Three-dimensional integrated circuit\n\nTopics\n\n• Automation\n\n• Collingridge dilemma\n\n• Differential technological development\n\n• Disruptive innovation\n\n• Ephemeralization\n\n• Ethics\n\n• AI\n\n• Bioethics\n\n• Cyberethics\n\n• Neuroethics\n\n• Robot ethics\n\n• Exploratory engineering\n\n• Proactionary principle\n\n• Technological change\n\n• Technological unemployment\n\n• Technological convergence\n\n• Technological evolution\n\n• Technological paradigm\n\n• Technology forecasting\n\n• Accelerating change\n\n• Future-oriented technology analysis\n\n• Horizon scanning\n\n• Moore's law\n\n• Technological singularity\n\n• Technology scouting\n\n• Technology in science fiction\n\n• Technology readiness level\n\n• Technology roadmap\n\n• Transhumanism\n\n• List\n\n• v\n\n• t\n\n• e\n\nRobotics\n\nMain articles\n\n• Outline\n\n• Glossary\n\n• Index\n\n• History\n\n• Geography\n\n• Hall of Fame\n\n• Ethics\n\n• Laws\n\n• Competitions\n\n• AI competitions\n\nTypes\n\n• Aerobot\n\n• Anthropomorphic\n\n• Humanoid\n\n• Android\n\n• Cyborg\n\n• Gynoid\n\n• Claytronics\n\n• Companion\n\n• Automaton\n\n• Animatronic\n\n• Audio-Animatronics\n\n• Industrial\n\n• Articulated\n\n• arm\n\n• Delivery\n\n• Domestic\n\n• Educational\n\n• Entertainment\n\n• Juggling\n\n• Military\n\n• Medical\n\n• Service\n\n• Disability\n\n• Agricultural\n\n• Food service\n\n• Retail\n\n• BEAM robotics\n\n• Soft robotics\n\nClassifications\n\n• Biorobotics\n\n• Cloud robotics\n\n• Continuum robot\n\n• Unmanned vehicle\n\n• aerial\n\n• ground\n\n• Mobile robot\n\n• Microbotics\n\n• Nanorobotics\n\n• Necrobotics\n\n• Robotic spacecraft\n\n• Space probe\n\n• Swarm\n\n• Telerobotics\n\n• Underwater\n\n• remotely-operated\n\n• Robotic fish\n\nLocomotion\n\n• Tracks\n\n• Walking\n\n• Hexapod\n\n• Climbing\n\n• Electric unicycle\n\n• Robotic fins\n\nNavigation and mapping\n\n• Motion planning\n\n• Simultaneous localization and mapping\n\n• Visual odometry\n\n• Vision-guided robot systems\n\nResearch\n\n• Evolutionary\n\n• Kits\n\n• Simulator\n\n• Suite\n\n• Open-source\n\n• Software\n\n• Adaptable\n\n• Developmental\n\n• Human-robot interaction\n\n• Paradigms\n\n• Perceptual\n\n• Situated\n\n• Ubiquitous\n\nCompanies\n\n• ABB\n\n• Amazon Robotics\n\n• Anybots\n\n• Barrett Technology\n\n• Boston Dynamics\n\n• Doosan Robotics\n\n• Energid Technologies\n\n• FarmWise\n\n• FANUC\n\n• Figure AI\n\n• Foster-Miller\n\n• Harvest Automation\n\n• HD Hyundai Robotics\n\n• Honeybee Robotics\n\n• Intuitive Surgical\n\n• IRobot\n\n• KUKA\n\n• Rainbow Robotics\n\n• Starship Technologies\n\n• Symbotic\n\n• Universal Robotics\n\n• Wolf Robotics\n\n• Yaskawa\n\nRelated\n\n• Critique of work\n\n• Powered exoskeleton\n\n• Workplace robotics safety\n\n• Robotic tech vest\n\n• Technological unemployment\n\n• Terrainability\n\n• Fictional robots\n\n• Category\n\n• Outline\n\n• v\n\n• t\n\n• e\n\nExistential risk from artificial intelligence\n\nConcepts\n\n• AGI\n\n• AI alignment\n\n• AI boom\n\n• AI capability control\n\n• AI safety\n\n• AI takeover\n\n• Effective accelerationism\n\n• Ethics of artificial intelligence\n\n• Existential risk from artificial intelligence\n\n• Friendly artificial intelligence\n\n• Instrumental convergence\n\n• Intelligence explosion\n\n• Longtermism\n\n• Machine ethics\n\n• Suffering risks\n\n• Superintelligence\n\n• Technological singularity\n\n• Vulnerable world hypothesis\n\nOrganizations\n\n• AI Futures Project\n\n• Alignment Research Center\n\n• Center for AI Safety\n\n• Center for Applied Rationality\n\n• Center for Human-Compatible Artificial Intelligence\n\n• Centre for the Study of Existential Risk\n\n• EleutherAI\n\n• Future of Humanity Institute\n\n• Future of Life Institute\n\n• Google DeepMind\n\n• Humanity+\n\n• Institute for Ethics and Emerging Technologies\n\n• Leverhulme Centre for the Future of Intelligence\n\n• Machine Intelligence Research Institute\n\n• METR\n\n• OpenAI\n\n• PauseAI\n\n• Safe Superintelligence\n\nPeople\n\n• Scott Alexander\n\n• Sam Altman\n\n• Yoshua Bengio\n\n• Nick Bostrom\n\n• Paul Christiano\n\n• Eric Drexler\n\n• Sam Harris\n\n• Stephen Hawking\n\n• Dan Hendrycks\n\n• Geoffrey Hinton\n\n• Bill Joy\n\n• Daniel Kokotajlo\n\n• Shane Legg\n\n• Jan Leike\n\n• Elon Musk\n\n• Steve Omohundro\n\n• Huw Price\n\n• Martin Rees\n\n• Stuart J. Russell\n\n• Nate Soares\n\n• Ilya Sutskever\n\n• Jaan Tallinn\n\n• Max Tegmark\n\n• Alan Turing\n\n• Frank Wilczek\n\n• Roman Yampolskiy\n\n• Eliezer Yudkowsky\n\nBooks\n\n• Do You Trust This Computer?\n\n• Human Compatible\n\n• If Anyone Builds It, Everyone Dies\n\n• Our Final Invention\n\n• Superintelligence: Paths, Dangers, Strategies\n\n• The Precipice: Existential Risk and the Future of Humanity\n\nOther\n\n• Artificial Intelligence Act\n\n• Open letter on artificial intelligence\n\n• Statement on AI Risk\n\nCategory\n\n• v\n\n• t\n\n• e\n\nSubfields of and cyberneticians involved in cybernetics\n\nSubfields\n\n• Artificial intelligence\n\n• Biological cybernetics\n\n• Biomedical cybernetics\n\n• Biorobotics\n\n• Biosemiotics\n\n• Neurocybernetics\n\n• Catastrophe theory\n\n• Computational neuroscience\n\n• Connectionism\n\n• Control theory\n\n• Conversation theory\n\n• Cybernetics in the Soviet Union\n\n• Decision theory\n\n• Emergence\n\n• Engineering cybernetics\n\n• Homeostasis\n\n• Information theory\n\n• Management cybernetics\n\n• Medical cybernetics\n\n• Second-order cybernetics\n\n• Cybersemiotics\n\n• Sociocybernetics\n\n• Synergetics\n\nCyberneticians\n\n• Alexander Lerner\n\n• Alexey Lyapunov\n\n• Alfred Radcliffe-Brown\n\n• Allenna Leonard\n\n• Anthony Wilden\n\n• Buckminster Fuller\n\n• Charles François\n\n• Genevieve Bell\n\n• Margaret Boden\n\n• Claude Bernard\n\n• Cliff Joslyn\n\n• Erich von Holst\n\n• Ernst von Glasersfeld\n\n• Francis Heylighen\n\n• Francisco Varela\n\n• Frederic Vester\n\n• Charles Geoffrey Vickers\n\n• Gordon Pask\n\n• Gordon S. Brown\n\n• Gregory Bateson\n\n• Heinz von Foerster\n\n• Humberto Maturana\n\n• I. A. Richards\n\n• Igor Aleksander\n\n• Jacque Fresco\n\n• Jakob von Uexküll\n\n• Jason Jixuan Hu\n\n• Jay Wright Forrester\n\n• Jennifer Wilby\n\n• John N. Warfield\n\n• Kevin Warwick\n\n• Ludwig von Bertalanffy\n\n• Maleyka Abbaszadeh\n\n• Manfred Clynes\n\n• Margaret Mead\n\n• Marian Mazur\n\n• N. Katherine Hayles\n\n• Natalia Bekhtereva\n\n• Niklas Luhmann\n\n• Norbert Wiener\n\n• Pyotr Grigorenko\n\n• Qian Xuesen\n\n• Ranulph Glanville\n\n• Robert Trappl\n\n• Sergei P. Kurdyumov\n\n• Stafford Beer\n\n• Stuart Kauffman\n\n• Stuart Umpleby\n\n• Talcott Parsons\n\n• Ulla Mitzdorf\n\n• Valentin Turchin\n\n• Valentin Braitenberg\n\n• William Ross Ashby\n\n• Walter Bradford Cannon\n\n• Walter Pitts\n\n• Warren McCulloch\n\n• William Grey Walter\n\n• v\n\n• t\n\n• e\n\nGlossaries of science and engineering\n\n• Aerospace engineering\n\n• Agriculture\n\n• Archaeology\n\n• Architecture\n\n• Artificial intelligence\n\n• Astronomy\n\n• Biology\n\n• Botany\n\n• Calculus\n\n• Cell biology\n\n• Cellular and molecular biology\n\n• 0-L\n\n• M-Z\n\n• Chemistry\n\n• Civil engineering\n\n• Clinical research\n\n• Computer hardware\n\n• Computer science\n\n• Developmental and reproductive biology\n\n• Ecology\n\n• Economics\n\n• Electrical and electronics engineering\n\n• Engineering\n\n• A-L\n\n• M-Z\n\n• Entomology\n\n• Environmental science\n\n• Genetics and evolutionary biology\n\n• Geography\n\n• A-M\n\n• N-Z\n\n• Arabic toponyms\n\n• Hebrew toponyms\n\n• Western and South Asia\n\n• Geology\n\n• Ichthyology\n\n• Machine vision\n\n• Mathematics\n\n• Mechanical engineering\n\n• Medicine\n\n• Meteorology\n\n• Mycology\n\n• Nanotechnology\n\n• Ornithology\n\n• Physics\n\n• Probability and statistics\n\n• Psychiatry\n\n• Quantum computing\n\n• Robotics\n\n• Scientific naming\n\n• Structural engineering\n\n• Virology\n\nAuthority control databases\n\nInternational\n\n• GND\n\nNational\n\n• United States\n\n• France\n\n• BnF data\n\n• Japan\n\n• Czech Republic\n\n• Spain\n\n• Latvia\n\n• Israel\n\nOther\n\n• Yale LUX\n\nRetrieved from \"https://en. wikipedia. org/w/index. php? title=Artificial_intelligence&oldid=1336676724\"\n\nCategories:\n\n• Artificial intelligence\n\n• Computational fields of study\n\n• Computational neuroscience\n\n• Cybernetics\n\n• Data science\n\n• Formal sciences\n\n• Intelligence by type\n\nHidden categories:\n\n• Webarchive template wayback links\n\n• CS1 German-language sources (de)\n\n• CS1 Russian-language sources (ru)\n\n• CS1 Japanese-language sources (ja)\n\n• Articles with short description\n\n• Short description is different from Wikidata\n\n• Use dmy dates from October 2025\n\n• Wikipedia indefinitely semi-protected pages\n\n• Articles with excerpts\n\n• Pages displaying short descriptions of redirect targets via Module: Annotated link\n\n• CS1: long volume value\n\n• Pages using Sister project links with hidden wikidata\n\n• Articles with Internet Encyclopedia of Philosophy links",
        "metadata": {
          "hash": "6c0e3ec4f8d5919ead2e6b9b03d1344a302ceca82997ecf0c9bad3c243ee4de6"
        },
        "sourceTrust": "medium",
        "fetchedAt": "2026-02-07T15:43:15.060Z"
      }
    },
    {
      "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
      "score": 0.8209865,
      "document": {
        "id": "195e389d-be7c-4008-8809-3bde88cd0ec1",
        "url": "https://en.wikipedia.org/wiki/Artificial_intelligence?t=1770479346182",
        "text": "Toggle the table of contents\n\n# Artificial intelligence\n\n173 languages\n\n• Afrikaans\n\n• Alemannisch\n\n• አማርኛ\n\n• अंगिका\n\n• العربية\n\n• Aragonés\n\n• Արեւմտահայերէն\n\n• অসমীয়া\n\n• Asturianu\n\n• Avañe'ẽ\n\n• Azərbaycanca\n\n• تۆرکجه\n\n• বাংলা\n\n• 閩南語 / Bân-lâm-gí\n\n• Башҡортса\n\n• Беларуская\n\n• Беларуская (тарашкевіца)\n\n• भोजपुरी\n\n• Bikol Central\n\n• Български\n\n• Boarisch\n\n• བོད་ཡིག\n\n• Bosanski\n\n• Brezhoneg\n\n• Буряад\n\n• Català\n\n• Чӑвашла\n\n• Cebuano\n\n• Čeština\n\n• Cymraeg\n\n• Dansk\n\n• الدارجة\n\n• Deutsch\n\n• Eesti\n\n• Ελληνικά\n\n• Español\n\n• Esperanto\n\n• Estremeñu\n\n• Euskara\n\n• فارسی\n\n• Fiji Hindi\n\n• Français\n\n• Furlan\n\n• Gaeilge\n\n• Gaelg\n\n• Gàidhlig\n\n• Galego\n\n• 贛語\n\n• Gĩkũyũ\n\n• गोंयची कोंकणी / Gõychi Konknni\n\n• 한국어\n\n• Hausa\n\n• Հայերեն\n\n• हिन्दी\n\n• Hrvatski\n\n• Ido\n\n• Igbo\n\n• Ilokano\n\n• Bahasa Indonesia\n\n• Interlingua\n\n• Interlingue\n\n• IsiZulu\n\n• Íslenska\n\n• Italiano\n\n• עברית\n\n• Jawa\n\n• ಕನ್ನಡ\n\n• ქართული\n\n• کٲشُر\n\n• Қазақша\n\n• Kiswahili\n\n• Kreyòl ayisyen\n\n• Kriyòl gwiyannen\n\n• Kurdî\n\n• Кыргызча\n\n• ລາວ\n\n• Latina\n\n• Latviešu\n\n• Lëtzebuergesch\n\n• Lietuvių\n\n• Ligure\n\n• Limburgs\n\n• La. lojban.\n\n• Lombard\n\n• Magyar\n\n• Madhurâ\n\n• Македонски\n\n• Malagasy\n\n• മലയാളം\n\n• Malti\n\n• मराठी\n\n• მარგალური\n\n• مصرى\n\n• Bahasa Melayu\n\n• Minangkabau\n\n• Монгол\n\n• မြန်မာဘာသာ\n\n• Nederlands\n\n• Nedersaksies\n\n• नेपाली\n\n• नेपाल भाषा\n\n• 日本語\n\n• Nordfriisk\n\n• Norsk bokmål\n\n• Norsk nynorsk\n\n• Occitan\n\n• ଓଡ଼ିଆ\n\n• Oʻzbekcha / ўзбекча\n\n• ਪੰਜਾਬੀ\n\n• پنجابی\n\n• ပအိုဝ်ႏဘာႏသာႏ\n\n• پښتو\n\n• Patois\n\n• ភាសាខ្មែរ\n\n• Picard\n\n• Piemontèis\n\n• Plattdüütsch\n\n• Polski\n\n• Português\n\n• Qaraqalpaqsha\n\n• Qırımtatarca\n\n• Reo tahiti\n\n• Ripoarisch\n\n• Română\n\n• Runa Simi\n\n• Русиньскый\n\n• Русский\n\n• Саха тыла\n\n• संस्कृतम्\n\n• Sängö\n\n• Scots\n\n• Sesotho sa Leboa\n\n• Shqip\n\n• Sicilianu\n\n• සිංහල\n\n• Simple English\n\n• سنڌي\n\n• Slovenčina\n\n• Slovenščina\n\n• کوردی\n\n• Српски / srpski\n\n• Srpskohrvatski / српскохрватски\n\n• Suomi\n\n• Svenska\n\n• Tagalog\n\n• தமிழ்\n\n• Татарча / tatarça\n\n• తెలుగు\n\n• ไทย\n\n• Тоҷикӣ\n\n• Türkçe\n\n• Türkmençe\n\n• Українська\n\n• اردو\n\n• ئۇيغۇرچە / Uyghurche\n\n• Vèneto\n\n• Tiếng Việt\n\n• Võro\n\n• Walon\n\n• 文言\n\n• Winaray\n\n• 吴语\n\n• ייִדיש\n\n• 粵語\n\n• Zazaki\n\n• Žemaitėška\n\n• 中文\n\n• Betawi\n\n• Kadazandusun\n\n• Fɔ̀ngbè\n\n• Jaku Iban\n\n• ꠍꠤꠟꠐꠤ\n\n• ⵜⴰⵎⴰⵣⵉⵖⵜ ⵜⴰⵏⴰⵡⴰⵢⵜ\n\nEdit links\n\n• Article\n\n• Talk\n\nEnglish\n\n• Read\n\n• View source\n\n• View history\n\nTools\n\nTools\n\nmove to sidebar\nhide\n\nActions\n\n• Read\n\n• View source\n\n• View history\n\nGeneral\n\n• What links here\n\n• Related changes\n\n• Upload file\n\n• Permanent link\n\n• Page information\n\n• Cite this page\n\n• Get shortened URL\n\n• Download QR code\n\n• Edit interlanguage links\n\n• Expand all\n\nPrint/export\n\n• Download as PDF\n\n• Printable version\n\nIn other projects\n\n• Wikimedia Commons\n\n• Wikibooks\n\n• Wikiquote\n\n• Wikiversity\n\n• Wikidata item\n\nAppearance\n\nmove to sidebar\nhide\n\nText\n\n•\n\nSmall\n\nStandard\n\nLarge\n\nThis page always uses small font size\n\nWidth\n\n•\n\nStandard\n\nWide\n\nThe content is as wide as possible for your browser window.\n\nColor (beta)\n\n•\n\nAutomatic\n\nLight\n\nDark\n\nThis page is always in light mode.\n\nFrom Wikipedia, the free encyclopedia\n\n\"AI\" redirects here. For other uses, see AI (disambiguation) and Artificial intelligence (disambiguation).\n\nPart of a series on\n\nArtificial intelligence (AI)\n\nshow\nMajor goals\n\nshow\nApproaches\n\nshow\nApplications\n\nshow\nPhilosophy\n\nshow\nHistory\n\nshow\nControversies\n\nshow\nGlossary\n\n• v\n\n• t\n\n• e\n\nArtificial intelligence (AI) is the capability of computational systems to perform tasks typically associated with human intelligence, such as learning, reasoning, problem-solving, perception, and decision-making. It is a field of research in computer science that develops and studies methods and software that enable machines to perceive their environment and use learning and intelligence to take actions that maximize their chances of achieving defined goals.[1]\n\nHigh-profile applications of AI include advanced web search engines (e. g., Google Search); recommendation systems (used by YouTube, Amazon, and Netflix); virtual assistants (e. g., Google Assistant, Siri, and Alexa); autonomous vehicles (e. g., Waymo); generative and creative tools (e. g., language models and AI art); and superhuman play and analysis in strategy games (e. g., chess and Go). However, many AI applications are not perceived as AI: \"A lot of cutting edge AI has filtered into general applications, often without being called AI because once something becomes useful enough and common enough it's not labeled AI anymore.\"[2][3]\n\nVarious subfields of AI research are centered around particular goals and the use of particular tools. The traditional goals of AI research include learning, reasoning, knowledge representation, planning, natural language processing, perception, and support for robotics.[a] To reach these goals, AI researchers have adapted and integrated a wide range of techniques, including search and mathematical optimization, formal logic, artificial neural networks, and methods based on statistics, operations research, and economics.[b] AI also draws upon psychology, linguistics, philosophy, neuroscience, and other fields.[4] Some companies, such as OpenAI, Google DeepMind and Meta,[5] aim to create artificial general intelligence (AGI) - AI that can complete virtually any cognitive task at least as well as a human.\n\nArtificial intelligence was founded as an academic discipline in 1956,[6] and the field went through multiple cycles of optimism throughout its history,[7][8] followed by periods of disappointment and loss of funding, known as AI winters.[9][10] Funding and interest vastly increased after 2012 when graphics processing units started being used to accelerate neural networks, and deep learning outperformed previous AI techniques.[11] This growth accelerated further after 2017 with the transformer architecture.[12] In the 2020s, an ongoing period of rapid progress in advanced generative AI became known as the AI boom. Generative AI's ability to create and modify content has led to several unintended consequences and harms. Ethical concerns have been raised about AI's long-term effects and potential existential risks, prompting discussions about regulatory policies to ensure the safety and benefits of the technology.\n\n## Goals\n\nThe general problem of simulating (or creating) intelligence has been broken into subproblems. These consist of particular traits or capabilities that researchers expect an intelligent system to display. The traits described below have received the most attention and cover the scope of AI research.[a]\n\n### Reasoning and problem-solving\n\nEarly researchers developed algorithms that imitated step-by-step reasoning that humans use when they solve puzzles or make logical deductions.[13] By the late 1980s and 1990s, methods were developed for dealing with uncertain or incomplete information, employing concepts from probability and economics.[14]\n\nMany of these algorithms are insufficient for solving large reasoning problems because they experience a \"combinatorial explosion\": They become exponentially slower as the problems grow.[15] Even humans rarely use the step-by-step deduction that early AI research could model. They solve most of their problems using fast, intuitive judgments.[16] Accurate and efficient reasoning is an unsolved problem.\n\n### Knowledge representation\n\nAn ontology represents knowledge as a set of concepts within a domain and the relationships between those concepts.\n\nKnowledge representation and knowledge engineering[17] allow AI programs to answer questions intelligently and make deductions about real-world facts. Formal knowledge representations are used in content-based indexing and retrieval,[18] scene interpretation,[19] clinical decision support,[20] knowledge discovery (mining \"interesting\" and actionable inferences from large databases),[21] and other areas.[22]\n\nA knowledge base is a body of knowledge represented in a form that can be used by a program. An ontology is the set of objects, relations, concepts, and properties used by a particular domain of knowledge.[23] Knowledge bases need to represent things such as objects, properties, categories, and relations between objects;[24] situations, events, states, and time;[25] causes and effects;[26] knowledge about knowledge (what we know about what other people know);[27] default reasoning (things that humans assume are true until they are told differently and will remain true even when other facts are changing);[28] and many other aspects and domains of knowledge.\n\nAmong the most difficult problems in knowledge representation are the breadth of commonsense knowledge (the set of atomic facts that the average person knows is enormous);[29] and the sub-symbolic form of most commonsense knowledge (much of what people know is not represented as \"facts\" or \"statements\" that they could express verbally).[16] There is also the difficulty of knowledge acquisition, the problem of obtaining knowledge for AI applications.[c]\n\n### Planning and decision-making\n\nAn \"agent\" is anything that perceives and takes actions in the world. A rational agent has goals or preferences and takes actions to make them happen.[d][32] In automated planning, the agent has a specific goal.[33] In automated decision-making, the agent has preferences-there are some situations it would prefer to be in, and some situations it is trying to avoid. The decision-making agent assigns a number to each situation (called the \"utility\") that measures how much the agent prefers it. For each possible action, it can calculate the \"expected utility\": the utility of all possible outcomes of the action, weighted by the probability that the outcome will occur. It can then choose the action with the maximum expected utility.[34]\n\nIn classical planning, the agent knows exactly what the effect of any action will be.[35] In most real-world problems, however, the agent may not be certain about the situation they are in (it is \"unknown\" or \"unobservable\") and it may not know for certain what will happen after each possible action (it is not \"deterministic\"). It must choose an action by making a probabilistic guess and then reassess the situation to see if the action worked.[36]\n\nIn some problems, the agent's preferences may be uncertain, especially if there are other agents or humans involved. These can be learned (e. g., with inverse reinforcement learning), or the agent can seek information to improve its preferences.[37] Information value theory can be used to weigh the value of exploratory or experimental actions.[38] The space of possible future actions and situations is typically intractably large, so the agents must take actions and evaluate situations while being uncertain of what the outcome will be.\n\nA Markov decision process has a transition model that describes the probability that a particular action will change the state in a particular way and a reward function that supplies the utility of each state and the cost of each action. A policy associates a decision with each possible state. The policy could be calculated (e. g., by iteration), be heuristic, or it can be learned.[39]\n\nGame theory describes the rational behavior of multiple interacting agents and is used in AI programs that make decisions that involve other agents.[40]\n\n### Learning\n\nMachine learning is the study of programs that can improve their performance on a given task automatically.[41] It has been a part of AI from the beginning.[e]\n\nIn supervised learning, the training data is labelled with the expected answers, while in unsupervised learning, the model identifies patterns or structures in unlabelled data.\n\nThere are several kinds of machine learning. Unsupervised learning analyzes a stream of data and finds patterns and makes predictions without any other guidance.[44] Supervised learning requires labeling the training data with the expected answers, and comes in two main varieties: classification (where the program must learn to predict what category the input belongs in) and regression (where the program must deduce a numeric function based on numeric input).[45]\n\nIn reinforcement learning, the agent is rewarded for good responses and punished for bad ones. The agent learns to choose responses that are classified as \"good\".[46] Transfer learning is when the knowledge gained from one problem is applied to a new problem.[47] Deep learning is a type of machine learning that runs inputs through biologically inspired artificial neural networks for all of these types of learning.[48]\n\nComputational learning theory can assess learners by computational complexity, by sample complexity (how much data is required), or by other notions of optimization.[49]\n\n### Natural language processing\n\nNatural language processing (NLP) allows programs to read, write and communicate in human languages.[50] Specific problems include speech recognition, speech synthesis, machine translation, information extraction, information retrieval and question answering.[51]\n\nEarly work, based on Noam Chomsky's generative grammar and semantic networks, had difficulty with word-sense disambiguation[f] unless restricted to small domains called \"micro-worlds\" (due to the common sense knowledge problem[29]). Margaret Masterman believed that it was meaning and not grammar that was the key to understanding languages, and that thesauri and not dictionaries should be the basis of computational language structure.\n\nModern deep learning techniques for NLP include word embedding (representing words, typically as vectors encoding their meaning),[52] transformers (a deep learning architecture using an attention mechanism),[53] and others.[54] In 2019, generative pre-trained transformer (or \"GPT\") language models began to generate coherent text,[55][56] and by 2023, these models were able to get human-level scores on the bar exam, SAT test, GRE test, and many other real-world applications.[57]\n\n### Perception\n\nMachine perception is the ability to use input from sensors (such as cameras, microphones, wireless signals, active lidar, sonar, radar, and tactile sensors) to deduce aspects of the world. Computer vision is the ability to analyze visual input.[58]\n\nThe field includes speech recognition,[59] image classification,[60] facial recognition, object recognition,[61] object tracking,[62] and robotic perception.[63]\n\n### Social intelligence\n\nKismet, a robot head which was made in the 1990s; it is a machine that can recognize and simulate emotions.[64]\n\nAffective computing is a field that comprises systems that recognize, interpret, process, or simulate human feeling, emotion, and mood.[65] For example, some virtual assistants are programmed to speak conversationally or even to banter humorously; it makes them appear more sensitive to the emotional dynamics of human interaction, or to otherwise facilitate human-computer interaction.\n\nHowever, this tends to give naïve users an unrealistic conception of the intelligence of existing computer agents.[66] Moderate successes related to affective computing include textual sentiment analysis and, more recently, multimodal sentiment analysis, wherein AI classifies the effects displayed by a videotaped subject.[67]\n\n### General intelligence\n\nA machine with artificial general intelligence would be able to solve a wide variety of problems with breadth and versatility similar to human intelligence.[68]\n\n## Techniques\n\nAI research uses a wide variety of techniques to accomplish the goals above.[b]\n\n### Search and optimization\n\nAI can solve many problems by intelligently searching through many possible solutions.[69] There are two very different kinds of search used in AI: state space search and local search.\n\n#### State space search\n\nState space search searches through a tree of possible states to try to find a goal state.[70] For example, planning algorithms search through trees of goals and subgoals, attempting to find a path to a target goal, a process called means-ends analysis.[71]\n\nSimple exhaustive searches[72] are rarely sufficient for most real-world problems: the search space (the number of places to search) quickly grows to astronomical numbers. The result is a search that is too slow or never completes.[15] \"Heuristics\" or \"rules of thumb\" can help prioritize choices that are more likely to reach a goal.[73]\n\nAdversarial search is used for game-playing programs, such as chess or Go. It searches through a tree of possible moves and countermoves, looking for a winning position.[74]\n\n#### Local search\n\nIllustration of gradient descent for 3 different starting points; two parameters (represented by the plan coordinates) are adjusted in order to minimize the loss function (the height)\n\nLocal search uses mathematical optimization to find a solution to a problem. It begins with some form of guess and refines it incrementally.[75]\n\nGradient descent is a type of local search that optimizes a set of numerical parameters by incrementally adjusting them to minimize a loss function. Variants of gradient descent are commonly used to train neural networks,[76] through the backpropagation algorithm.\n\nAnother type of local search is evolutionary computation, which aims to iteratively improve a set of candidate solutions by \"mutating\" and \"recombining\" them, selecting only the fittest to survive each generation.[77]\n\nDistributed search processes can coordinate via swarm intelligence algorithms. Two popular swarm algorithms used in search are particle swarm optimization (inspired by bird flocking) and ant colony optimization (inspired by ant trails).[78]\n\n### Logic\n\nFormal logic is used for reasoning and knowledge representation.[79]\nFormal logic comes in two main forms: propositional logic (which operates on statements that are true or false and uses logical connectives such as \"and\", \"or\", \"not\" and \"implies\")[80] and predicate logic (which also operates on objects, predicates and relations and uses quantifiers such as \"Every X is a Y\" and \"There are some Xs that are Ys\").[81]\n\nDeductive reasoning in logic is the process of proving a new statement (conclusion) from other statements that are given and assumed to be true (the premises).[82] Proofs can be structured as proof trees, in which nodes are labelled by sentences, and children nodes are connected to parent nodes by inference rules.\n\nGiven a problem and a set of premises, problem-solving reduces to searching for a proof tree whose root node is labelled by a solution of the problem and whose leaf nodes are labelled by premises or axioms. In the case of Horn clauses, problem-solving search can be performed by reasoning forwards from the premises or backwards from the problem.[83] In the more general case of the clausal form of first-order logic, resolution is a single, axiom-free rule of inference, in which a problem is solved by proving a contradiction from premises that include the negation of the problem to be solved.[84]\n\nInference in both Horn clause logic and first-order logic is undecidable, and therefore intractable. However, backward reasoning with Horn clauses, which underpins computation in the logic programming language Prolog, is Turing complete. Moreover, its efficiency is competitive with computation in other symbolic programming languages.[85]\n\nFuzzy logic assigns a \"degree of truth\" between 0 and 1. It can therefore handle propositions that are vague and partially true.[86]\n\nNon-monotonic logics, including logic programming with negation as failure, are designed to handle default reasoning.[28] Other specialized versions of logic have been developed to describe many complex domains.\n\n### Probabilistic methods for uncertain reasoning\n\nA simple Bayesian network, with the associated conditional probability tables\n\nMany problems in AI (including reasoning, planning, learning, perception, and robotics) require the agent to operate with incomplete or uncertain information. AI researchers have devised a number of tools to solve these problems using methods from probability theory and economics.[87] Precise mathematical tools have been developed that analyze how an agent can make choices and plan, using decision theory, decision analysis,[88] and information value theory.[89] These tools include models such as Markov decision processes,[90] dynamic decision networks,[91] game theory and mechanism design.[92]\n\nBayesian networks[93] are a tool that can be used for reasoning (using the Bayesian inference algorithm),[g][95] learning (using the expectation-maximization algorithm),[h][97] planning (using decision networks)[98] and perception (using dynamic Bayesian networks).[91]\n\nProbabilistic algorithms can also be used for filtering, prediction, smoothing, and finding explanations for streams of data, thus helping perception systems analyze processes that occur over time (e. g., hidden Markov models or Kalman filters).[91]\n\nExpectation-maximization clustering of Old Faithful eruption data starts from a random guess but then successfully converges on an accurate clustering of the two physically distinct modes of eruption.\n\n### Classifiers and statistical learning methods\n\nThe simplest AI applications can be divided into two types: classifiers (e. g., \"if shiny then diamond\"), on one hand, and controllers (e. g., \"if diamond then pick up\"), on the other hand. Classifiers[99] are functions that use pattern matching to determine the closest match. They can be fine-tuned based on chosen examples using supervised learning. Each pattern (also called an \"observation\") is labeled with a certain predefined class. All the observations combined with their class labels are known as a data set. When a new observation is received, that observation is classified based on previous experience.[45]\n\nThere are many kinds of classifiers in use.[100] The decision tree is the simplest and most widely used symbolic machine learning algorithm.[101] K-nearest neighbor algorithm was the most widely used analogical AI until the mid-1990s, and Kernel methods such as the support vector machine (SVM) displaced k-nearest neighbor in the 1990s.[102]\nThe naive Bayes classifier is reportedly the \"most widely used learner\"[103] at Google, due in part to its scalability.[104]\nNeural networks are also used as classifiers.[105]\n\n### Artificial neural networks\n\nA neural network is an interconnected group of nodes, akin to the vast network of neurons in the human brain.\n\nAn artificial neural network is based on a collection of nodes also known as artificial neurons, which loosely model the neurons in a biological brain. It is trained to recognise patterns; once trained, it can recognise those patterns in fresh data. There is an input, at least one hidden layer of nodes and an output. Each node applies a function and once the weight crosses its specified threshold, the data is transmitted to the next layer. A network is typically called a deep neural network if it has at least 2 hidden layers.[105]\n\nLearning algorithms for neural networks use local search to choose the weights that will get the right output for each input during training. The most common training technique is the backpropagation algorithm.[106] Neural networks learn to model complex relationships between inputs and outputs and find patterns in data. In theory, a neural network can learn any function.[107]\n\nIn feedforward neural networks the signal passes in only one direction.[108] The term perceptron typically refers to a single-layer neural network.[109] In contrast, deep learning uses many layers.[110] Recurrent neural networks (RNNs) feed the output signal back into the input, which allows short-term memories of previous input events. Long short-term memory networks (LSTMs) are recurrent neural networks that better preserve longterm dependencies and are less sensitive to the vanishing gradient problem.[111] Convolutional neural networks (CNNs) use layers of kernels to more efficiently process local patterns. This local processing is especially important in image processing, where the early CNN layers typically identify simple local patterns such as edges and curves, with subsequent layers detecting more complex patterns like textures, and eventually whole objects.[112]\n\n### Deep learning\n\nDeep learning is a subset of machine learning, which is itself a subset of artificial intelligence.[113]\n\nDeep learning uses several layers of neurons between the network's inputs and outputs.[110] The multiple layers can progressively extract higher-level features from the raw input. For example, in image processing, lower layers may identify edges, while higher layers may identify the concepts relevant to a human such as digits, letters, or faces.[114]\n\nDeep learning has profoundly improved the performance of programs in many important subfields of artificial intelligence, including computer vision, speech recognition, natural language processing, image classification,[115] and others. The reason that deep learning performs so well in so many applications is not known as of 2021.[116] The sudden success of deep learning in 2012-2015 did not occur because of some new discovery or theoretical breakthrough (deep neural networks and backpropagation had been described by many people, as far back as the 1950s)[i] but because of two factors: the incredible increase in computer power (including the hundred-fold increase in speed by switching to GPUs) and the availability of vast amounts of training data, especially the giant curated datasets used for benchmark testing, such as ImageNet.[j]\n\n### GPT\n\nGenerative pre-trained transformers (GPT) are large language models (LLMs) that generate text based on the semantic relationships between words in sentences. Text-based GPT models are pre-trained on a large corpus of text that can be from the Internet. The pretraining consists of predicting the next token (a token being usually a word, subword, or punctuation). Throughout this pretraining, GPT models accumulate knowledge about the world and can then generate human-like text by repeatedly predicting the next token. Typically, a subsequent training phase makes the model more truthful, useful, and harmless, usually with a technique called reinforcement learning from human feedback (RLHF). Current GPT models are prone to generating falsehoods called \"hallucinations\". These can be reduced with RLHF and quality data, but the problem has been getting worse for reasoning systems.[124] Such systems are used in chatbots, which allow people to ask a question or request a task in simple text.[125][126]\n\nCurrent models and services include ChatGPT, Claude, Gemini, Copilot, and Meta AI.[127] Multimodal GPT models can process different types of data (modalities) such as images, videos, sound, and text.[128]\n\n### Hardware and software\n\nMain articles: Programming languages for artificial intelligence and Hardware for artificial intelligence\n\nRaspberry Pi AI Kit\n\nIn the late 2010s, graphics processing units (GPUs) that were increasingly designed with AI-specific enhancements and used with specialized TensorFlow software had replaced previously used central processing unit (CPUs) as the dominant means for large-scale (commercial and academic) machine learning models' training.[129] Specialized programming languages such as Prolog were used in early AI research,[130] but general-purpose programming languages like Python have become predominant.[131]\n\nThe transistor density in integrated circuits has been observed to roughly double every 18 months-a trend known as Moore's law, named after the Intel co-founder Gordon Moore, who first identified it. Improvements in GPUs have been even faster,[132] a trend sometimes called Huang's law,[133] named after Nvidia co-founder and CEO Jensen Huang.\n\n## Applications\n\nMain article: Applications of artificial intelligence\n\nAI and machine learning technology is used in most of the essential applications of the 2020s, including:\n\n• search engines (such as Google Search)\n\n• targeting online advertisements\n\n• recommendation systems (offered by Netflix, YouTube or Amazon) driving internet traffic\n\n• targeted advertising (AdSense, Facebook)\n\n• virtual assistants (such as Siri or Alexa)\n\n• autonomous vehicles (including drones, ADAS and self-driving cars)\n\n• automatic language translation (Microsoft Translator, Google Translate)\n\n• facial recognition (Apple's FaceID or Microsoft's DeepFace and Google's FaceNet)\n\n• image labeling (used by Facebook, Apple's Photos and TikTok).\n\nThe deployment of AI may be overseen by a chief automation officer (CAO).\n\n### Health and medicine\n\nMain article: Artificial intelligence in healthcare\n\nIt has been suggested that AI can overcome discrepancies in funding allocated to different fields of research.[134]\n\nAlphaFold 2 (2021) demonstrated the ability to approximate, in hours rather than months, the 3D structure of a protein.[135] In 2023, it was reported that AI-guided drug discovery helped find a class of antibiotics capable of killing two different types of drug-resistant bacteria.[136] In 2024, researchers used machine learning to accelerate the search for Parkinson's disease drug treatments. Their aim was to identify compounds that block the clumping, or aggregation, of alpha-synuclein (the protein that characterises Parkinson's disease). They were able to speed up the initial screening process ten-fold and reduce the cost by a thousand-fold.[137][138]\n\n### Gaming\n\nMain article: Artificial intelligence in video games\n\nGame playing programs have been used since the 1950s to demonstrate and test AI's most advanced techniques.[139] Deep Blue became the first computer chess-playing system to beat a reigning world chess champion, Garry Kasparov, on 11 May 1997.[140] In 2011, in a Jeopardy! quiz show exhibition match, IBM's question answering system, Watson, defeated the two greatest Jeopardy! champions, Brad Rutter and Ken Jennings, by a significant margin.[141] In March 2016, AlphaGo won 4 out of 5 games of Go in a match with Go champion Lee Sedol, becoming the first computer Go-playing system to beat a professional Go player without handicaps. Then, in 2017, it defeated Ke Jie, who was the best Go player in the world.[142] Other programs handle imperfect-information games, such as the poker-playing program Pluribus.[143] DeepMind developed increasingly generalistic reinforcement learning models, such as with MuZero, which could be trained to play chess, Go, or Atari games.[144] In 2019, DeepMind's AlphaStar achieved grandmaster level in StarCraft II, a particularly challenging real-time strategy game that involves incomplete knowledge of what happens on the map.[145] In 2021, an AI agent competed in a PlayStation Gran Turismo competition, winning against four of the world's best Gran Turismo drivers using deep reinforcement learning.[146] In 2024, Google DeepMind introduced SIMA, a type of AI capable of autonomously playing nine previously unseen open-world video games by observing screen output, as well as executing short, specific tasks in response to natural language instructions.[147]\n\n### Mathematics\n\nLarge language models, such as GPT-4, Gemini, Claude, Llama or Mistral, are increasingly used in mathematics. These probabilistic models are versatile, but can also produce wrong answers in the form of hallucinations. They sometimes need a large database of mathematical problems to learn from, but also methods such as supervised fine-tuning[148] or trained classifiers with human-annotated data to improve answers for new problems and learn from corrections.[149] A February 2024 study showed that the performance of some language models for reasoning capabilities in solving math problems not included in their training data was low, even for problems with only minor deviations from trained data.[150] One technique to improve their performance involves training the models to produce correct reasoning steps, rather than just the correct result.[151] The Alibaba Group developed a version of its Qwen models called Qwen2-Math, that achieved state-of-the-art performance on several mathematical benchmarks, including 84% accuracy on the MATH dataset of competition mathematics problems.[152] In January 2025, Microsoft proposed the technique rStar-Math that leverages Monte Carlo tree search and step-by-step reasoning, enabling a relatively small language model like Qwen-7B to solve 53% of the AIME 2024 and 90% of the MATH benchmark problems.[153]\n\nAlternatively, dedicated models for mathematical problem solving with higher precision for the outcome including proof of theorems have been developed such as AlphaTensor, AlphaGeometry, AlphaProof and AlphaEvolve[154] all from Google DeepMind,[155] Llemma from EleutherAI[156] or Julius.[157]\n\nWhen natural language is used to describe mathematical problems, converters can transform such prompts into a formal language such as Lean to define mathematical tasks. The experimental model Gemini Deep Think accepts natural language prompts directly and achieved gold medal results in the International Math Olympiad of 2025.[158]\n\nSome models have been developed to solve challenging problems and reach good results in benchmark tests, others to serve as educational tools in mathematics.[159]\n\nTopological deep learning integrates various topological approaches.\n\n### Finance\n\nFinance is one of the fastest growing sectors where applied AI tools are being deployed: from retail online banking to investment advice and insurance, where automated \"robot advisers\" have been in use for some years.[160]\n\nAccording to Nicolas Firzli, director of the World Pensions & Investments Forum, it may be too early to see the emergence of highly innovative AI-informed financial products and services. He argues that \"the deployment of AI tools will simply further automatise things: destroying tens of thousands of jobs in banking, financial planning, and pension advice in the process, but I'm not sure it will unleash a new wave of [e. g., sophisticated] pension innovation.\"[161]\n\n### Military\n\nMain article: Military applications of artificial intelligence\n\nVarious countries are deploying AI military applications.[162] The main applications enhance command and control, communications, sensors, integration and interoperability.[163] Research is targeting intelligence collection and analysis, logistics, cyber operations, information operations, and semiautonomous and autonomous vehicles.[162] AI technologies enable coordination of sensors and effectors, threat detection and identification, marking of enemy positions, target acquisition, coordination and deconfliction of distributed Joint Fires between networked combat vehicles, both human-operated and autonomous.[163]\n\nAI has been used in military operations in Iraq, Syria, Israel and Ukraine.[162][164][165][166]\n\n### Generative AI\n\nVincent van Gogh in watercolour created by generative AI software\n\nThese paragraphs are an excerpt from Generative artificial intelligence.[edit]\n\nGenerative artificial intelligence, also known as generative AI or GenAI, is a subfield of artificial intelligence that uses generative models to generate text, images, videos, audio, software code or other forms of data.[167]\nThese models learn the underlying patterns and structures of their training data and use them to generate new data[168]\nin response to input, which often takes the form of natural language prompts.[169][170]\nThe generated material is often called AIGC (AI Generated Content).[citation needed]\n\nThe prevalence of generative AI tools has increased significantly since the AI boom in the 2020s. This boom was made possible by improvements in deep neural networks, particularly large language models (LLMs), which are based on the transformer architecture. Generative AI applications include chatbots such as ChatGPT, Claude, Copilot, DeepSeek, Google Gemini and Grok; text-to-image models such as Stable Diffusion, Midjourney, and DALL-E; and text-to-video models such as Veo, LTX and Sora.[171][172][173]\n\nCompanies in a variety of sectors have used generative AI, including those in software development, healthcare,[174] finance,[175] entertainment,[176] customer service,[177] sales and marketing,[178] art, writing,[179] and product design.[180]\n\n### Agents\n\nMain article: Agentic AI\n\nAI agents are software entities designed to perceive their environment, make decisions, and take actions autonomously to achieve specific goals. These agents can interact with users, their environment, or other agents. AI agents are used in various applications, including virtual assistants, chatbots, autonomous vehicles, game-playing systems, and industrial robotics. AI agents operate within the constraints of their programming, available computational resources, and hardware limitations. This means they are restricted to performing tasks within their defined scope and have finite memory and processing capabilities. In real-world applications, AI agents often face time constraints for decision-making and action execution. Many AI agents incorporate learning algorithms, enabling them to improve their performance over time through experience or training. Using machine learning, AI agents can adapt to new situations and optimise their behaviour for their designated tasks.[181][182][183]\n\n### Web search\n\nMicrosoft introduced Copilot Search in February 2023 under the name Bing Chat, as a built-in feature for Microsoft Edge and Bing mobile app. Copilot Search provides AI-generated summaries[184] and step-by-step reasoning based of information from web publishers, ranked in Bing Search.[185]\nFor safety, Copilot uses AI-based classifiers and filters to reduce potentially harmful content.[186]\n\nGoogle officially pushed its AI Search at its Google I/O event on 20 May 2025.[187] It keeps people looking at Google instead of clicking on a search result. AI Overviews uses Gemini 2.5 to provide contextual answers to user queries based on web content.[188]\n\n### Sexuality\n\nApplications of AI in this domain include AI-enabled menstruation and fertility trackers that analyze user data to offer predictions,[189] AI-integrated sex toys (e. g., teledildonics),[190] AI-generated sexual education content,[191] and AI agents that simulate sexual and romantic partners (e. g., Replika).[192] AI is also used for the production of non-consensual deepfake pornography, raising significant ethical and legal concerns.[193]\n\nAI technologies have also been used to attempt to identify online gender-based violence and online sexual grooming of minors.[194][195]\n\n### Other industry-specific tasks\n\nThere are also thousands of successful AI applications used to solve specific problems for specific industries or institutions. In a 2017 survey, one in five companies reported having incorporated \"AI\" in some offerings or processes.[196] A few examples are energy storage, medical diagnosis, military logistics, applications that predict the result of judicial decisions, foreign policy, or supply chain management.\n\nAI applications for evacuation and disaster management are growing. AI has been used to investigate patterns in large-scale and small-scale evacuations using historical data from GPS, videos or social media. Furthermore, AI can provide real-time information on the evacuation conditions.[197][198][199]\n\nIn agriculture, AI has helped farmers to increase yield and identify areas that need irrigation, fertilization, pesticide treatments. Agronomists use AI to conduct research and development. AI has been used to predict the ripening time for crops such as tomatoes, monitor soil moisture, operate agricultural robots, conduct predictive analytics, classify livestock pig call emotions, automate greenhouses, detect diseases and pests, and save water.\n\nArtificial intelligence is used in astronomy to analyze increasing amounts of available data and applications, mainly for \"classification, regression, clustering, forecasting, generation, discovery, and the development of new scientific insights.\" For example, it is used for discovering exoplanets, forecasting solar activity, and distinguishing between signals and instrumental effects in gravitational wave astronomy. Additionally, it could be used for activities in space, such as space exploration, including the analysis of data from space missions, real-time science decisions of spacecraft, space debris avoidance, and more autonomous operation.\n\nDuring the 2024 Indian elections, US$50 million was spent on authorized AI-generated content, notably by creating deepfakes of allied (including sometimes deceased) politicians to better engage with voters, and by translating speeches to various local languages.[200]\n\n## Ethics\n\nMain article: Ethics of artificial intelligence\n\nStreet art in Tel Aviv[201][202]\n\nAI has potential benefits and potential risks.[203] AI may be able to advance science and find solutions for serious problems: Demis Hassabis of DeepMind hopes to \"solve intelligence, and then use that to solve everything else\".[204] However, as the use of AI has become widespread, several unintended consequences and risks have been identified.[205][206] In-production systems can sometimes not factor ethics and bias into their AI training processes, especially when the AI algorithms are inherently unexplainable in deep learning.[207]\n\n### Risks and harm\n\n#### Privacy and copyright\n\nFurther information: Information privacy and Artificial intelligence and copyright\n\nMachine learning algorithms require large amounts of data. The techniques used to acquire this data have raised concerns about privacy, surveillance and copyright.\n\nAI-powered devices and services, such as virtual assistants and IoT products, continuously collect personal information, raising concerns about intrusive data gathering and unauthorized access by third parties. The loss of privacy is further exacerbated by AI's ability to process and combine vast amounts of data, potentially leading to a surveillance society where individual activities are constantly monitored and analyzed without adequate safeguards or transparency.\n\nSensitive user data collected may include online activity records, geolocation data, video, or audio.[208] For example, in order to build speech recognition algorithms, Amazon has recorded millions of private conversations and allowed temporary workers to listen to and transcribe some of them.[209] Opinions about this widespread surveillance range from those who see it as a necessary evil to those for whom it is clearly unethical and a violation of the right to privacy.[210]\n\nAI developers argue that this is the only way to deliver valuable applications and have developed several techniques that attempt to preserve privacy while still obtaining the data, such as data aggregation, de-identification and differential privacy.[211] Since 2016, some privacy experts, such as Cynthia Dwork, have begun to view privacy in terms of fairness. Brian Christian wrote that experts have pivoted \"from the question of 'what they know' to the question of 'what they're doing with it'.\"[212]\n\nGenerative AI is often trained on unlicensed copyrighted works, including in domains such as images or computer code; the output is then used under the rationale of \"fair use\". Experts disagree about how well and under what circumstances this rationale will hold up in courts of law; relevant factors may include \"the purpose and character of the use of the copyrighted work\" and \"the effect upon the potential market for the copyrighted work\".[213][214] Website owners can indicate that they do not want their content scraped via a \"robots. txt\" file.[215] However, some companies will scrape content regardless[216][217] because the robots. txt file has no real authority. In 2023, leading authors (including John Grisham and Jonathan Franzen) sued AI companies for using their work to train generative AI.[218][219] Another discussed approach is to envision a separate sui generis system of protection for creations generated by AI to ensure fair attribution and compensation for human authors.[220]\n\n#### Dominance by tech giants\n\nThe commercial AI scene is dominated by Big Tech companies such as Alphabet Inc., Amazon, Apple Inc., Meta Platforms, and Microsoft.[221][222][223] Some of these players already own the vast majority of existing cloud infrastructure and computing power from data centers, allowing them to entrench further in the marketplace.[224][225]\n\n#### Power needs and environmental impacts\n\nSee also: Environmental impacts of artificial intelligence\n\nFueled by growth in artificial intelligence, data centers' demand for power increased in the 2020s.[226]\n\nIn January 2024, the International Energy Agency (IEA) released Electricity 2024, Analysis and Forecast to 2026, forecasting electric power use.[227] This is the first IEA report to make projections for data centers and power consumption for artificial intelligence and cryptocurrency. The report states that power demand for these uses might double by 2026, with additional electric power usage equal to electricity used by the whole Japanese nation.[228]\n\nProdigious power consumption by AI is responsible for the growth of fossil fuel use, and might delay closings of obsolete, carbon-emitting coal energy facilities. There is a feverish rise in the construction of data centers throughout the US, making large technology firms (e. g., Microsoft, Meta, Google, Amazon) into voracious consumers of electric power. Projected electric consumption is so immense that there is concern that it will be fulfilled no matter the source. A ChatGPT search involves the use of 10 times the electrical energy as a Google search. The large firms are in haste to find power sources - from nuclear energy to geothermal to fusion. The tech firms argue that - in the long view - AI will be eventually kinder to the environment, but they need the energy now. AI makes the power grid more efficient and \"intelligent\", will assist in the growth of nuclear power, and track overall carbon emissions, according to technology firms.[229]\n\nA 2024 Goldman Sachs Research Paper, AI Data Centers and the Coming US Power Demand Surge, found \"US power demand (is) likely to experience growth not seen in a generation....\" and forecasts that, by 2030, US data centers will consume 8% of US power, as opposed to 3% in 2022, presaging growth for the electrical power generation industry by a variety of means.[230] Data centers' need for more and more electrical power is such that they might max out the electrical grid. The Big Tech companies counter that AI can be used to maximize the utilization of the grid by all.[231]\n\nIn 2024, the Wall Street Journal reported that big AI companies have begun negotiations with the US nuclear power providers to provide electricity to the data centers. In March 2024 Amazon purchased a Pennsylvania nuclear-powered data center for US$650 million.[232] Nvidia CEO Jensen Huang said nuclear power is a good option for the data centers.[233]\n\nIn September 2024, Microsoft announced an agreement with Constellation Energy to re-open the Three Mile Island nuclear power plant to provide Microsoft with 100% of all electric power produced by the plant for 20 years. Reopening the plant, which suffered a partial nuclear meltdown of its Unit 2 reactor in 1979, will require Constellation to get through strict regulatory processes which will include extensive safety scrutiny from the US Nuclear Regulatory Commission. If approved (this will be the first ever US re-commissioning of a nuclear plant), over 835 megawatts of power - enough for 800,000 homes - of energy will be produced. The cost for re-opening and upgrading is estimated at US$1.6 billion and is dependent on tax breaks for nuclear power contained in the 2022 US Inflation Reduction Act.[234] The US government and the state of Michigan are investing almost US$2 billion to reopen the Palisades Nuclear reactor on Lake Michigan. Closed since 2022, the plant is planned to be reopened in October 2025. The Three Mile Island facility will be renamed the Crane Clean Energy Center after Chris Crane, a nuclear proponent and former CEO of Exelon who was responsible for Exelon's spinoff of Constellation.[235]\n\nAfter the last approval in September 2023, Taiwan suspended the approval of data centers north of Taoyuan with a capacity of more than 5 MW in 2024, due to power supply shortages.[236] Taiwan aims to phase out nuclear power by 2025.[236] On the other hand, Singapore imposed a ban on the opening of data centers in 2019 due to electric power, but in 2022, lifted this ban.[236]\n\nAlthough most nuclear plants in Japan have been shut down after the 2011 Fukushima nuclear accident, according to an October 2024 Bloomberg article in Japanese, cloud gaming services company Ubitus, in which Nvidia has a stake, is looking for land in Japan near a nuclear power plant for a new data center for generative AI.[237] Ubitus CEO Wesley Kuo said nuclear power plants are the most efficient, cheap and stable power for AI.[237]\n\nOn 1 November 2024, the Federal Energy Regulatory Commission (FERC) rejected an application submitted by Talen Energy for approval to supply some electricity from the nuclear power station Susquehanna to Amazon's data center.[238]\nAccording to the Commission Chairman Willie L. Phillips, it is a burden on the electricity grid as well as a significant cost shifting concern to households and other business sectors.[238]\n\nIn 2025, a report prepared by the International Energy Agency estimated the greenhouse gas emissions from the energy consumption of AI at 180 million tons. By 2035, these emissions could rise to 300-500 million tonnes depending on what measures will be taken. This is below 1.5% of the energy sector emissions. The emissions reduction potential of AI was estimated at 5% of the energy sector emissions, but rebound effects (for example if people switch from public transport to autonomous cars) can reduce it.[239]\n\n#### Misinformation\n\nSee also: Content moderation\n\nYouTube, Facebook and others use recommender systems to guide users to more content. These AI programs were given the goal of maximizing user engagement (that is, the only goal was to keep people watching). The AI learned that users tended to choose misinformation, conspiracy theories, and extreme partisan content, and, to keep them watching, the AI recommended more of it. Users also tended to watch more content on the same subject, so the AI led people into filter bubbles where they received multiple versions of the same misinformation.[240] This convinced many users that the misinformation was true, and ultimately undermined trust in institutions, the media and the government.[241] The AI program had correctly learned to maximize its goal, but the result was harmful to society. After the U. S. election in 2016, major technology companies took some steps to mitigate the problem.[242]\n\nIn the early 2020s, generative AI began to create images, audio, and texts that are virtually indistinguishable from real photographs, recordings, or human writing,[243] while realistic AI-generated videos became feasible in the mid-2020s.[244][245][246] It is possible for bad actors to use this technology to create massive amounts of misinformation or propaganda;[247] one such potential malicious use is deepfakes for computational propaganda.[248] AI pioneer and Nobel Prize-winning computer scientist Geoffrey Hinton expressed concern about AI enabling \"authoritarian leaders to manipulate their electorates\" on a large scale, among other risks.[249] The ability to influence electorates has been proved in at least one study. This same study shows more inaccurate statements from the models when they advocate for candidates of the political right.[250]\n\nAI researchers at Microsoft, OpenAI, universities and other organisations have suggested using \"personhood credentials\" as a way to overcome online deception enabled by AI models.[251]\n\n#### Algorithmic bias and fairness\n\nMain articles: Algorithmic bias and Fairness (machine learning)\n\nMachine learning applications can be biased[k] if they learn from biased data.[253] The developers may not be aware that the bias exists.[254] Discriminatory behavior by some LLMs can be observed in their output.[255] Bias can be introduced by the way training data is selected and by the way a model is deployed.[256][253] If a biased algorithm is used to make decisions that can seriously harm people (as it can in medicine, finance, recruitment, housing or policing) then the algorithm may cause discrimination.[257] The field of fairness studies how to prevent harms from algorithmic biases.\n\nOn 28 June 2015, Google Photos's new image labeling feature mistakenly identified Jacky Alcine and a friend as \"gorillas\" because they were black. The system was trained on a dataset that contained very few images of black people,[258] a problem called \"sample size disparity\".[259] Google \"fixed\" this problem by preventing the system from labelling anything as a \"gorilla\". Eight years later, in 2023, Google Photos still could not identify a gorilla, and neither could similar products from Apple, Facebook, Microsoft and Amazon.[260]\n\nCOMPAS is a commercial program widely used by U. S. courts to assess the likelihood of a defendant becoming a recidivist. In 2016, Julia Angwin at ProPublica discovered that COMPAS exhibited racial bias, despite the fact that the program was not told the races of the defendants. Although the error rate for both whites and blacks was calibrated equal at exactly 61%, the errors for each race were different-the system consistently overestimated the chance that a black person would re-offend and would underestimate the chance that a white person would not re-offend.[261] In 2017, several researchers[l] showed that it was mathematically impossible for COMPAS to accommodate all possible measures of fairness when the base rates of re-offense were different for whites and blacks in the data.[263]\n\nA program can make biased decisions even if the data does not explicitly mention a problematic feature (such as \"race\" or \"gender\"). The feature will correlate with other features (like \"address\", \"shopping history\" or \"first name\"), and the program will make the same decisions based on these features as it would on \"race\" or \"gender\".[264] Moritz Hardt said \"the most robust fact in this research area is that fairness through blindness doesn't work.\"[265]\n\nCriticism of COMPAS highlighted that machine learning models are designed to make \"predictions\" that are only valid if we assume that the future will resemble the past. If they are trained on data that includes the results of racist decisions in the past, machine learning models must predict that racist decisions will be made in the future. If an application then uses these predictions as recommendations, some of these \"recommendations\" will likely be racist.[266] Thus, machine learning is not well suited to help make decisions in areas where there is hope that the future will be better than the past. It is descriptive rather than prescriptive.[m]\n\nBias and unfairness may go undetected because the developers are overwhelmingly white and male: among AI engineers, about 4% are black and 20% are women.[259]\n\nThere are various conflicting definitions and mathematical models of fairness. These notions depend on ethical assumptions, and are influenced by beliefs about society. One broad category is distributive fairness, which focuses on the outcomes, often identifying groups and seeking to compensate for statistical disparities. Representational fairness tries to ensure that AI systems do not reinforce negative stereotypes or render certain groups invisible. Procedural fairness focuses on the decision process rather than the outcome. The most relevant notions of fairness may depend on the context, notably the type of AI application and the stakeholders. The subjectivity in the notions of bias and fairness makes it difficult for companies to operationalize them. Having access to sensitive attributes such as race or gender is also considered by many AI ethicists to be necessary in order to compensate for biases, but it may conflict with anti-discrimination laws.[252]\n\nAt the 2022 ACM Conference on Fairness, Accountability, and Transparency a paper reported that a CLIP-based (Contrastive Language-Image Pre-training) robotic system reproduced harmful gender- and race-linked stereotypes in a simulated manipulation task. The authors recommended robot-learning methods which physically manifest such harms be \"paused, reworked, or even wound down when appropriate, until outcomes can be proven safe, effective, and just.\"[268][269][270]\n\n#### Lack of transparency\n\nSee also: Explainable AI, Algorithmic transparency, and Right to explanation\n\nMany AI systems are so complex that their designers cannot explain how they reach their decisions.[271] Particularly with deep neural networks, in which there are many non-linear relationships between inputs and outputs. But some popular explainability techniques exist.[272]\n\nIt is impossible to be certain that a program is operating correctly if no one knows how exactly it works. There have been many cases where a machine learning program passed rigorous tests, but nevertheless learned something different than what the programmers intended. For example, a system that could identify skin diseases better than medical professionals was found to actually have a strong tendency to classify images with a ruler as \"cancerous\", because pictures of malignancies typically include a ruler to show the scale.[273] Another machine learning system designed to help effectively allocate medical resources was found to classify patients with asthma as being at \"low risk\" of dying from pneumonia. Having asthma is actually a severe risk factor, but since the patients having asthma would usually get much more medical care, they were relatively unlikely to die according to the training data. The correlation between asthma and low risk of dying from pneumonia was real, but misleading.[274]\n\nPeople who have been harmed by an algorithm's decision have a right to an explanation.[275] Doctors, for example, are expected to clearly and completely explain to their colleagues the reasoning behind any decision they make. Early drafts of the European Union's General Data Protection Regulation in 2016 included an explicit statement that this right exists.[n] Industry experts noted that this is an unsolved problem with no solution in sight. Regulators argued that nevertheless the harm is real: if the problem has no solution, the tools should not be used.[276]\n\nDARPA established the XAI (\"Explainable Artificial Intelligence\") program in 2014 to try to solve these problems.[277]\n\nSeveral approaches aim to address the transparency problem. SHAP enables to visualise the contribution of each feature to the output.[278] LIME can locally approximate a model's outputs with a simpler, interpretable model.[279] Multitask learning provides a large number of outputs in addition to the target classification. These other outputs can help developers deduce what the network has learned.[280] Deconvolution, DeepDream and other generative methods can allow developers to see what different layers of a deep network for computer vision have learned, and produce output that can suggest what the network is learning.[281] For generative pre-trained transformers, Anthropic developed a technique based on dictionary learning that associates patterns of neuron activations with human-understandable concepts.[282]\n\n#### Bad actors and weaponized AI\n\nMain articles: Lethal autonomous weapon, Artificial intelligence arms race, and AI safety\n\nArtificial intelligence provides a number of tools that are useful to bad actors, such as authoritarian governments, terrorists, criminals or rogue states.\n\nA lethal autonomous weapon is a machine that locates, selects and engages human targets without human supervision.[o] Widely available AI tools can be used by bad actors to develop inexpensive autonomous weapons and, if produced at scale, they are potentially weapons of mass destruction.[284] Even when used in conventional warfare, they currently cannot reliably choose targets and could potentially kill an innocent person.[284] In 2014, 30 nations (including China) supported a ban on autonomous weapons under the United Nations' Convention on Certain Conventional Weapons, however the United States and others disagreed.[285] By 2015, over fifty countries were reported to be researching battlefield robots.[286]\n\nAI tools make it easier for authoritarian governments to efficiently control their citizens in several ways. Face and voice recognition allow widespread surveillance. Machine learning, operating this data, can classify potential enemies of the state and prevent them from hiding. Recommendation systems can precisely target propaganda and misinformation for maximum effect. Deepfakes and generative AI aid in producing misinformation. Advanced AI can make authoritarian centralized decision-making more competitive than liberal and decentralized systems such as markets. It lowers the cost and difficulty of digital warfare and advanced spyware.[287] All these technologies have been available since 2020 or earlier-AI facial recognition systems are already being used for mass surveillance in China.[288][289]\n\nThere are many other ways in which AI is expected to help bad actors, some of which can not be foreseen. For example, machine-learning AI is able to design tens of thousands of toxic molecules in a matter of hours.[290]\n\n#### Technological unemployment\n\nMain articles: Workplace impact of artificial intelligence and Technological unemployment\n\nEconomists have frequently highlighted the risks of redundancies from AI, and speculated about unemployment if there is no adequate social policy for full employment.[291]\n\nIn the past, technology has tended to increase rather than reduce total employment, but economists acknowledge that \"we're in uncharted territory\" with AI.[292] A survey of economists showed disagreement about whether the increasing use of robots and AI will cause a substantial increase in long-term unemployment, but they generally agree that it could be a net benefit if productivity gains are redistributed.[293] Risk estimates vary; for example, in the 2010s, Michael Osborne and Carl Benedikt Frey estimated 47% of U. S. jobs are at \"high risk\" of potential automation, while an OECD report classified only 9% of U. S. jobs as \"high risk\".[p][295] The methodology of speculating about future employment levels has been criticised as lacking evidential foundation, and for implying that technology, rather than social policy, creates unemployment, as opposed to redundancies.[291] In April 2023, it was reported that 70% of the jobs for Chinese video game illustrators had been eliminated by generative artificial intelligence.[296][297]\n\nUnlike previous waves of automation, many middle-class jobs may be eliminated by artificial intelligence; The Economist stated in 2015 that \"the worry that AI could do to white-collar jobs what steam power did to blue-collar ones during the Industrial Revolution\" is \"worth taking seriously\".[298] Jobs at extreme risk range from paralegals to fast food cooks, while job demand is likely to increase for care-related professions ranging from personal healthcare to the clergy.[299] In July 2025, Ford CEO Jim Farley predicted that \"artificial intelligence is going to replace literally half of all white-collar workers in the U. S.\"[300]\n\nFrom the early days of the development of artificial intelligence, there have been arguments, for example, those put forward by Joseph Weizenbaum, about whether tasks that can be done by computers actually should be done by them, given the difference between computers and humans, and between quantitative calculation and qualitative, value-based judgement.[301]\n\n#### Existential risk\n\nMain article: Existential risk from artificial intelligence\n\nRecent public debates in artificial intelligence have increasingly focused on its broader societal and ethical implications. It has been argued AI will become so powerful that humanity may irreversibly lose control of it. This could, as physicist Stephen Hawking stated, \"spell the end of the human race\".[302] This scenario has been common in science fiction, when a computer or robot suddenly develops a human-like \"self-awareness\" (or \"sentience\" or \"consciousness\") and becomes a malevolent character.[q] These sci-fi scenarios are misleading in several ways.\n\nFirst, AI does not require human-like sentience to be an existential risk. Modern AI programs are given specific goals and use learning and intelligence to achieve them. Philosopher Nick Bostrom argued that if one gives almost any goal to a sufficiently powerful AI, it may choose to destroy humanity to achieve it (he used the example of an automated paperclip factory that destroys the world to get more iron for paperclips).[304] Stuart Russell gives the example of household robot that tries to find a way to kill its owner to prevent it from being unplugged, reasoning that \"you can't fetch the coffee if you're dead.\"[305] In order to be safe for humanity, a superintelligence would have to be genuinely aligned with humanity's morality and values so that it is \"fundamentally on our side\".[306]\n\nSecond, Yuval Noah Harari argues that AI does not require a robot body or physical control to pose an existential risk. The essential parts of civilization are not physical. Things like ideologies, law, government, money and the economy are built on language; they exist because there are stories that billions of people believe. The current prevalence of misinformation suggests that an AI could use language to convince people to believe anything, even to take actions that are destructive.[307] Geoffrey Hinton said in 2025 that modern AI is particularly \"good at persuasion\" and getting better all the time. He asks \"Suppose you wanted to invade the capital of the US. Do you have to go there and do it yourself? No. You just have to be good at persuasion.\"[308]\n\nThe opinions amongst experts and industry insiders are mixed, with sizable fractions both concerned and unconcerned by risk from eventual superintelligent AI.[309] Personalities such as Stephen Hawking, Bill Gates, and Elon Musk,[310] as well as AI pioneers such as Geoffrey Hinton, Yoshua Bengio, Stuart Russell, Demis Hassabis, and Sam Altman, have expressed concerns about existential risk from AI.\n\nIn May 2023, Geoffrey Hinton announced his resignation from Google in order to be able to \"freely speak out about the risks of AI\" without \"considering how this impacts Google\".[311] He notably mentioned risks of an AI takeover,[312] and stressed that in order to avoid the worst outcomes, establishing safety guidelines will require cooperation among those competing in use of AI.[313]\n\nIn 2023, many leading AI experts endorsed the joint statement that \"Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war\".[314]\n\nSome other researchers were more optimistic. AI pioneer Jürgen Schmidhuber did not sign the joint statement, emphasising that in 95% of all cases, AI research is about making \"human lives longer and healthier and easier.\"[315] While the tools that are now being used to improve lives can also be used by bad actors, \"they can also be used against the bad actors.\"[316][317] Andrew Ng also argued that \"it's a mistake to fall for the doomsday hype on AI-and that regulators who do will only benefit vested interests.\"[318] Yann LeCun \", a Turing Award winner, disagreed with the idea that AI will subordinate humans \"simply because they are smarter, let alone destroy [us]\",[319] \"scoff[ing] at his peers' dystopian scenarios of supercharged misinformation and even, eventually, human extinction.\"[320] In the early 2010s, experts argued that the risks are too distant in the future to warrant research or that humans will be valuable from the perspective of a superintelligent machine.[321] However, after 2016, the study of current and future risks and possible solutions became a serious area of research.[322]\n\n### Ethical machines and alignment\n\nMain articles: Machine ethics, AI safety, Friendly artificial intelligence, Artificial moral agents, and Human Compatible\n\nSee also: Human-AI interaction\n\nFriendly AI are machines that have been designed from the beginning to minimize risks and to make choices that benefit humans. Eliezer Yudkowsky, who coined the term, argues that developing friendly AI should be a higher research priority: it may require a large investment and it must be completed before AI becomes an existential risk.[323]\n\nMachines with intelligence have the potential to use their intelligence to make ethical decisions. The field of machine ethics provides machines with ethical principles and procedures for resolving ethical dilemmas.[324]\nThe field of machine ethics is also called computational morality,[324]\nand was founded at an AAAI symposium in 2005.[325]\n\nOther approaches include Wendell Wallach's \"artificial moral agents\"[326] and Stuart J. Russell's three principles for developing provably beneficial machines.[327]\n\n### Open source\n\nSee also: Open-source artificial intelligence and Lists of open-source artificial intelligence software\n\nActive organizations in the AI open-source community include Hugging Face,[328] Google,[329] EleutherAI and Meta.[330] Various AI models, such as Llama 2, Mistral or Stable Diffusion, have been made open-weight,[331][332] meaning that their architecture and trained parameters (the \"weights\") are publicly available. Open-weight models can be freely fine-tuned, which allows companies to specialize them with their own data and for their own use-case.[333] Open-weight models are useful for research and innovation but can also be misused. Since they can be fine-tuned, any built-in security measure, such as objecting to harmful requests, can be trained away until it becomes ineffective. Some researchers warn that future AI models may develop dangerous capabilities (such as the potential to drastically facilitate bioterrorism) and that once released on the Internet, they cannot be deleted everywhere if needed. They recommend pre-release audits and cost-benefit analyses.[334]\n\n### Frameworks\n\nArtificial intelligence projects can be guided by ethical considerations during the design, development, and implementation of an AI system. An AI framework such as the Care and Act Framework, developed by the Alan Turing Institute and based on the SUM values, outlines four main ethical dimensions, defined as follows:[335][336]\n\n• Respect the dignity of individual people\n\n• Connect with other people sincerely, openly, and inclusively\n\n• Care for the wellbeing of everyone\n\n• Protect social values, justice, and the public interest\n\nOther developments in ethical frameworks include those decided upon during the Asilomar Conference, the Montreal Declaration for Responsible AI, and the IEEE's Ethics of Autonomous Systems initiative, among others;[337] however, these principles are not without criticism, especially regarding the people chosen to contribute to these frameworks.[338]\n\nPromotion of the wellbeing of the people and communities that these technologies affect requires consideration of the social and ethical implications at all stages of AI system design, development and implementation, and collaboration between job roles such as data scientists, product managers, data engineers, domain experts, and delivery managers.[339]\n\nThe UK AI Safety Institute released in 2024 a testing toolset called 'Inspect' for AI safety evaluations available under an MIT open-source licence which is freely available on GitHub and can be improved with third-party packages. It can be used to evaluate AI models in a range of areas including core knowledge, ability to reason, and autonomous capabilities.[340]\n\n### Regulation\n\nMain articles: Regulation of artificial intelligence, Regulation of algorithms, and AI safety\n\nThe first global AI Safety Summit was held in the United Kingdom in November 2023 with a declaration calling for international cooperation.\n\nThe regulation of artificial intelligence is the development of public sector policies and laws for promoting and regulating AI; it is therefore related to the broader regulation of algorithms.[341] The regulatory and policy landscape for AI is an emerging issue in jurisdictions globally.[342] According to AI Index at Stanford, the annual number of AI-related laws passed in the 127 survey countries jumped from one passed in 2016 to 37 passed in 2022 alone.[343][344] Between 2016 and 2020, more than 30 countries adopted dedicated strategies for AI.[345] Most EU member states had released national AI strategies, as had Canada, China, India, Japan, Mauritius, the Russian Federation, Saudi Arabia, United Arab Emirates, U. S., and Vietnam. Others were in the process of elaborating their own AI strategy, including Bangladesh, Malaysia and Tunisia.[345] The Global Partnership on Artificial Intelligence was launched in June 2020, stating a need for AI to be developed in accordance with human rights and democratic values, to ensure public confidence and trust in the technology.[345] Henry Kissinger, Eric Schmidt, and Daniel Huttenlocher published a joint statement in November 2021 calling for a government commission to regulate AI.[346] In 2023, OpenAI leaders published recommendations for the governance of superintelligence, which they believe may happen in less than 10 years.[347] In 2023, the United Nations also launched an advisory body to provide recommendations on AI governance; the body comprises technology company executives, government officials and academics.[348] On 1 August 2024, the EU Artificial Intelligence Act entered into force, establishing the first comprehensive EU-wide AI regulation.[349] In 2024, the Council of Europe created the first international legally binding treaty on AI, called the \"Framework Convention on Artificial Intelligence and Human Rights, Democracy and the Rule of Law\". It was adopted by the European Union, the United States, the United Kingdom, and other signatories.[350]\n\nIn a 2022 Ipsos survey, attitudes towards AI varied greatly by country; 78% of Chinese citizens, but only 35% of Americans, agreed that \"products and services using AI have more benefits than drawbacks\".[343] A 2023 Reuters/Ipsos poll found that 61% of Americans agree, and 22% disagree, that AI poses risks to humanity.[351] In a 2023 Fox News poll, 35% of Americans thought it \"very important\", and an additional 41% thought it \"somewhat important\", for the federal government to regulate AI, versus 13% responding \"not very important\" and 8% responding \"not at all important\".[352][353]\n\nIn November 2023, the first global AI Safety Summit was held in Bletchley Park in the UK to discuss the near and far term risks of AI and the possibility of mandatory and voluntary regulatory frameworks.[354] 28 countries including the United States, China, and the European Union issued a declaration at the start of the summit, calling for international co-operation to manage the challenges and risks of artificial intelligence.[355][356] In May 2024 at the AI Seoul Summit, 16 global AI tech companies agreed to safety commitments on the development of AI.[357][358]\n\n## History\n\nMain article: History of artificial intelligence\n\nFor a chronological guide, see Timeline of artificial intelligence.\n\nIn 2024, AI patents in China and the US numbered more than three-fourths of AI patents worldwide.[359] Though China had more AI patents, the US had 35% more patents per AI patent-applicant company than China.[359]\n\nThe study of mechanical or \"formal\" reasoning began with philosophers and mathematicians in antiquity. The study of logic led directly to Alan Turing's theory of computation, which suggested that a machine, by shuffling symbols as simple as \"0\" and \"1\", could simulate any conceivable form of mathematical reasoning.[360][361] This, along with concurrent discoveries in cybernetics, information theory and neurobiology, led researchers to consider the possibility of building an \"electronic brain\".[r] They developed several areas of research that would become part of AI,[363] such as McCulloch and Pitts design for \"artificial neurons\" in 1943,[117] and Turing's influential 1950 paper 'Computing Machinery and Intelligence', which introduced the Turing test and showed that \"machine intelligence\" was plausible.[364][361]\n\nThe field of AI research was founded at a workshop at Dartmouth College in 1956.[s][6] The attendees became the leaders of AI research in the 1960s.[t] They and their students produced programs that the press described as \"astonishing\":[u] computers were learning checkers strategies, solving word problems in algebra, proving logical theorems and speaking English.[v][7] Artificial intelligence laboratories were set up at a number of British and U. S. universities in the latter 1950s and early 1960s.[361]\n\nResearchers in the 1960s and the 1970s were convinced that their methods would eventually succeed in creating a machine with general intelligence and considered this the goal of their field.[368] In 1965 Herbert Simon predicted, \"machines will be capable, within twenty years, of doing any work a man can do\".[369] In 1967 Marvin Minsky agreed, writing that \"within a generation... the problem of creating 'artificial intelligence' will substantially be solved\".[370] They had, however, underestimated the difficulty of the problem.[w] In 1974, both the U. S. and British governments cut off exploratory research in response to the criticism of Sir James Lighthill[372] and ongoing pressure from the U. S. Congress to fund more productive projects.[373] Minsky and Papert's book Perceptrons was understood as proving that artificial neural networks would never be useful for solving real-world tasks, thus discrediting the approach altogether.[374] The \"AI winter\", a period when obtaining funding for AI projects was difficult, followed.[9]\n\nIn the early 1980s, AI research was revived by the commercial success of expert systems,[375] a form of AI program that simulated the knowledge and analytical skills of human experts. By 1985, the market for AI had reached over a billion dollars. At the same time, Japan's fifth generation computer project inspired the U. S. and British governments to restore funding for academic research.[8] However, beginning with the collapse of the Lisp Machine market in 1987, AI once again fell into disrepute, and a second, longer-lasting winter began.[10]\n\nUp to this point, most of AI's funding had gone to projects that used high-level symbols to represent mental objects like plans, goals, beliefs, and known facts. In the 1980s, some researchers began to doubt that this approach would be able to imitate all the processes of human cognition, especially perception, robotics, learning and pattern recognition,[376] and began to look into \"sub-symbolic\" approaches.[377] Rodney Brooks rejected \"representation\" in general and focussed directly on engineering machines that move and survive.[x] Judea Pearl, Lotfi Zadeh, and others developed methods that handled incomplete and uncertain information by making reasonable guesses rather than precise logic.[87][382] But the most important development was the revival of \"connectionism\", including neural network research, by Geoffrey Hinton and others.[383] In 1990, Yann LeCun successfully showed that convolutional neural networks can recognize handwritten digits, the first of many successful applications of neural networks.[384]\n\nAI gradually restored its reputation in the late 1990s and early 21st century by exploiting formal mathematical methods and by finding specific solutions to specific problems. This \"narrow\" and \"formal\" focus allowed researchers to produce verifiable results and collaborate with other fields (such as statistics, economics and mathematics).[385] By 2000, solutions developed by AI researchers were being widely used, although in the 1990s they were rarely described as \"artificial intelligence\" (a tendency known as the AI effect).[386]\nHowever, several academic researchers became concerned that AI was no longer pursuing its original goal of creating versatile, fully intelligent machines. Beginning around 2002, they founded the subfield of artificial general intelligence (or \"AGI\"), which had several well-funded institutions by the 2010s.[68]\n\nDeep learning began to dominate industry benchmarks in 2012 and was adopted throughout the field.[11]\nFor many specific tasks, other methods were abandoned.[y]\nDeep learning's success was based on both hardware improvements (faster computers,[388] graphics processing units, cloud computing[389]) and access to large amounts of data[390] (including curated datasets,[389] such as ImageNet). Deep learning's success led to an enormous increase in interest and funding in AI.[z] The amount of machine learning research (measured by total publications) increased by 50% in the years 2015-2019.[345]\n\nThe number of Google searches for the term \"AI\" accelerated in 2022.\n\nIn 2016, issues of fairness and the misuse of technology were catapulted into center stage at machine learning conferences, publications vastly increased, funding became available, and many researchers re-focussed their careers on these issues. The alignment problem became a serious field of academic study.[322]\n\nIn the late 2010s and early 2020s, AGI companies began to deliver programs that created enormous interest. In 2015, AlphaGo, developed by DeepMind, beat the world champion Go player. The program taught only the game's rules and developed a strategy by itself. GPT-3 is a large language model that was released in 2020 by OpenAI and is capable of generating high-quality human-like text.[391] ChatGPT, launched on 30 November 2022, became the fastest-growing consumer software application in history, gaining over 100 million users in two months.[392] It marked what is widely regarded as AI's breakout year, bringing it into the public consciousness.[393] These programs, and others, inspired an aggressive AI boom, where large companies began investing billions of dollars in AI research. According to AI Impacts, about US$50 billion annually was invested in \"AI\" around 2022 in the U. S. alone and about 20% of the new U. S. Computer Science PhD graduates have specialized in \"AI\".[394] About 800,000 \"AI\"-related U. S. job openings existed in 2022.[395] According to PitchBook research, 22% of newly funded startups in 2024 claimed to be AI companies.[396]\n\n## Philosophy\n\nMain article: Philosophy of artificial intelligence\n\nPhilosophical debates have historically sought to determine the nature of intelligence and how to make intelligent machines.[397] Another major focus has been whether machines can be conscious, and the associated ethical implications.[398] Many other topics in philosophy are relevant to AI, such as epistemology and free will.[399] Rapid advancements have intensified public discussions on the philosophy and ethics of AI.[398]\n\n### Defining artificial intelligence\n\nSee also: Synthetic intelligence, Intelligent agent, Artificial mind, Virtual intelligence, and Dartmouth workshop\n\nAlan Turing wrote in 1950 \"I propose to consider the question 'can machines think'?\"[400] He advised changing the question from whether a machine \"thinks\", to \"whether or not it is possible for machinery to show intelligent behaviour\".[400] He devised the Turing test, which measures the ability of a machine to simulate human conversation.[364] Since we can only observe the behavior of the machine, it does not matter if it is \"actually\" thinking or literally has a \"mind\". Turing notes that we can not determine these things about other people but \"it is usual to have a polite convention that everyone thinks.\"[401]\n\nThe Turing test can provide some evidence of intelligence, but it penalizes non-human intelligent behavior.[402]\n\nRussell and Norvig agree with Turing that intelligence must be defined in terms of external behavior, not internal structure.[1] However, they are critical that the test requires the machine to imitate humans. \"Aeronautical engineering texts\", they wrote, \"do not define the goal of their field as making 'machines that fly so exactly like pigeons that they can fool other pigeons.'\"[403] AI founder John McCarthy agreed, writing that \"Artificial intelligence is not, by definition, simulation of human intelligence\".[404]\n\nMcCarthy defines intelligence as \"the computational part of the ability to achieve goals in the world\".[405] Another AI founder, Marvin Minsky, similarly describes it as \"the ability to solve hard problems\".[406] Artificial Intelligence: A Modern Approach defines it as the study of agents that perceive their environment and take actions that maximize their chances of achieving defined goals.[1]\n\nThe many differing definitiuons of AI have been critically analyzed.[407][408][409] During the 2020s AI boom, the term has been used as a marketing buzzword to promote products and services which do not use AI.[410]\n\n#### Legal definitions\n\nThe International Organization for Standardization describes an AI system as a \"an engineered system that generates outputs such as content, forecasts, recommendations, or decisions for a given set of human-defined objectives, and can operate with varying levels of automation\".[411] The EU AI Act defines an AI system as \"a machine-based system that is designed to operate with varying levels of autonomy and that may exhibit adaptiveness after deployment, and that, for explicit or implicit objectives, infers, from the input it receives, how to generate outputs such as predictions, content, recommendations, or decisions that can influence physical or virtual environments\".[412] In the United States, influential but non-binding guidance such as the National Institute of Standards and Technology's AI Risk Management Framework describes an AI system as \"an engineered or machine-based system that can, for a given set of objectives, generate outputs such as predictions, recommendations, or decisions influencing real or virtual environments. AI systems are designed to operate with varying levels of autonomy\".[413]\n\n### Evaluating approaches to AI\n\nNo established unifying theory or paradigm has guided AI research for most of its history.[aa] The unprecedented success of statistical machine learning in the 2010s eclipsed all other approaches (so much so that some sources, especially in the business world, use the term \"artificial intelligence\" to mean \"machine learning with neural networks\"). This approach is mostly sub-symbolic, soft and narrow. Critics argue that these questions may have to be revisited by future generations of AI researchers.\n\n#### Symbolic AI and its limits\n\nSymbolic AI (or \"GOFAI\")[415] simulated the high-level conscious reasoning that people use when they solve puzzles, express legal reasoning and do mathematics. They were highly successful at \"intelligent\" tasks such as algebra or IQ tests. In the 1960s, Newell and Simon proposed the physical symbol systems hypothesis: \"A physical symbol system has the necessary and sufficient means of general intelligent action.\"[416]\n\nHowever, the symbolic approach failed on many tasks that humans solve easily, such as learning, recognizing an object or commonsense reasoning. Moravec's paradox is the discovery that high-level \"intelligent\" tasks were easy for AI, but low level \"instinctive\" tasks were extremely difficult.[417] Philosopher Hubert Dreyfus had argued since the 1960s that human expertise depends on unconscious instinct rather than conscious symbol manipulation, and on having a \"feel\" for the situation, rather than explicit symbolic knowledge.[418] Although his arguments had been ridiculed and ignored when they were first presented, eventually, AI research came to agree with him.[ab][16]\n\nThe issue is not resolved: sub-symbolic reasoning can make many of the same inscrutable mistakes that human intuition does, such as algorithmic bias. Critics such as Noam Chomsky argue continuing research into symbolic AI will still be necessary to attain general intelligence,[420][421] in part because sub-symbolic AI is a move away from explainable AI: it can be difficult or impossible to understand why a modern statistical AI program made a particular decision. The emerging field of neuro-symbolic artificial intelligence attempts to bridge the two approaches.\n\n#### Neat vs. scruffy\n\nMain article: Neats and scruffies\n\n\"Neats\" hope that intelligent behavior is described using simple, elegant principles (such as logic, optimization, or neural networks). \"Scruffies\" expect that it necessarily requires solving a large number of unrelated problems. Neats defend their programs with theoretical rigor, scruffies rely mainly on incremental testing to see if they work. This issue was actively discussed in the 1970s and 1980s,[422] but eventually was seen as irrelevant. Modern AI has elements of both.\n\n#### Soft vs. hard computing\n\nMain article: Soft computing\n\nFinding a provably correct or optimal solution is intractable for many important problems.[15] Soft computing is a set of techniques, including genetic algorithms, fuzzy logic and neural networks, that are tolerant of imprecision, uncertainty, partial truth and approximation. Soft computing was introduced in the late 1980s and most successful AI programs in the 21st century are examples of soft computing with neural networks.\n\n#### Narrow vs. general AI\n\nMain articles: Weak artificial intelligence and Artificial general intelligence\n\nAI researchers are divided as to whether to pursue the goals of artificial general intelligence and superintelligence directly or to solve as many specific problems as possible (narrow AI) in hopes these solutions will lead indirectly to the field's long-term goals.[423][424] General intelligence is difficult to define and difficult to measure, and modern AI has had more verifiable successes by focusing on specific problems with specific solutions. The sub-field of artificial general intelligence studies this area exclusively.\n\n### Machine consciousness, sentience, and mind\n\nMain articles: Philosophy of artificial intelligence and Artificial consciousness\n\nThere is no settled consensus in philosophy of mind on whether a machine can have a mind, consciousness and mental states in the same sense that human beings do. This issue considers the internal experiences of the machine, rather than its external behavior. Mainstream AI research considers this issue irrelevant because it does not affect the goals of the field: to build machines that can solve problems using intelligence. Russell and Norvig add that \"[t]he additional project of making a machine conscious in exactly the way humans are is not one that we are equipped to take on.\"[425] However, the question has become central to the philosophy of mind. It is also typically the central question at issue in artificial intelligence in fiction.\n\n#### Consciousness\n\nMain articles: Hard problem of consciousness and Theory of mind\n\nDavid Chalmers identified two problems in understanding the mind, which he named the \"hard\" and \"easy\" problems of consciousness.[426] The easy problem is understanding how the brain processes signals, makes plans and controls behavior. The hard problem is explaining how this feels or why it should feel like anything at all, assuming we are right in thinking that it truly does feel like something (Dennett's consciousness illusionism says this is an illusion). While human information processing is easy to explain, human subjective experience is difficult to explain. For example, it is easy to imagine a color-blind person who has learned to identify which objects in their field of view are red, but it is not clear what would be required for the person to know what red looks like.[427]\n\n#### Computationalism and functionalism\n\nMain articles: Computational theory of mind and Functionalism (philosophy of mind)\n\nComputationalism is the position in the philosophy of mind that the human mind is an information processing system and that thinking is a form of computing. Computationalism argues that the relationship between mind and body is similar or identical to the relationship between software and hardware and thus may be a solution to the mind-body problem. This philosophical position was inspired by the work of AI researchers and cognitive scientists in the 1960s and was originally proposed by philosophers Jerry Fodor and Hilary Putnam.[428]\n\nPhilosopher John Searle characterized this position as \"strong AI\": \"The appropriately programmed computer with the right inputs and outputs would thereby have a mind in exactly the same sense human beings have minds.\"[ac] Searle challenges this claim with his Chinese room argument, which attempts to show that even a computer capable of perfectly simulating human behavior would not have a mind.[432]\n\n#### AI welfare and rights\n\nIt is difficult or impossible to reliably evaluate whether an advanced AI is sentient (has the ability to feel), and if so, to what degree.[433] But if there is a significant chance that a given machine can feel and suffer, then it may be entitled to certain rights or welfare protection measures, similarly to animals.[434][435] Sapience (a set of capacities related to high intelligence, such as discernment or self-awareness) may provide another moral basis for AI rights.[434] Robot rights are also sometimes proposed as a practical way to integrate autonomous agents into society.[436]\n\nIn 2017, the European Union considered granting \"electronic personhood\" to some of the most capable AI systems. Similarly to the legal status of companies, it would have conferred rights but also responsibilities.[437] Critics argued in 2018 that granting rights to AI systems would downplay the importance of human rights, and that legislation should focus on user needs rather than speculative futuristic scenarios. They also noted that robots lacked the autonomy to take part in society on their own.[438][439]\n\nProgress in AI increased interest in the topic. Proponents of AI welfare and rights often argue that AI sentience, if it emerges, would be particularly easy to deny. They warn that this may be a moral blind spot analogous to slavery or factory farming, which could lead to large-scale suffering if sentient AI is created and carelessly exploited.[435][434]\n\n## Future\n\n### Superintelligence and the singularity\n\nA superintelligence is a hypothetical agent that would possess intelligence far surpassing that of the brightest and most gifted human mind.[424] If research into artificial general intelligence produced sufficiently intelligent software, it might be able to reprogram and improve itself. The improved software would be even better at improving itself, leading to what I. J. Good called an \"intelligence explosion\" and Vernor Vinge called a \"singularity\".[440]\n\nHowever, technologies cannot improve exponentially indefinitely, and typically follow an S-shaped curve, slowing when they reach the physical limits of what the technology can do.[441]\n\n### Transhumanism\n\nMain article: Transhumanism\n\nRobot designer Hans Moravec, cyberneticist Kevin Warwick and inventor Ray Kurzweil have predicted that humans and machines may merge in the future into cyborgs that are more capable and powerful than either. This idea, called transhumanism, has roots in the writings of Aldous Huxley and Robert Ettinger.[442]\n\nEdward Fredkin argues that \"artificial intelligence is the next step in evolution\", an idea first proposed by Samuel Butler's \"Darwin among the Machines\" as far back as 1863, and expanded upon by George Dyson in his 1998 book Darwin Among the Machines: The Evolution of Global Intelligence.[443]\n\n## In fiction\n\nMain article: Artificial intelligence in fiction\n\nThe word \"robot\" itself was coined by Karel Čapek in his 1921 play R. U. R., the title standing for \"Rossum's Universal Robots\".\n\nThought-capable artificial beings have appeared as storytelling devices since antiquity,[444] and have been a persistent theme in science fiction.[445]\n\nA common trope in these works began with Mary Shelley's Frankenstein, where a human creation becomes a threat to its masters. This includes such works as Arthur C. Clarke's and Stanley Kubrick's 2001: A Space Odyssey (both 1968), with HAL 9000, the murderous computer in charge of the Discovery One spaceship, as well as The Terminator (1984) and The Matrix (1999). In contrast, the rare loyal robots such as Gort from The Day the Earth Stood Still (1951) and Bishop from Aliens (1986) are less prominent in popular culture.[446]\n\nIsaac Asimov introduced the Three Laws of Robotics in many stories, most notably with the \"Multivac\" super-intelligent computer. Asimov's laws are often brought up during lay discussions of machine ethics;[447] while almost all artificial intelligence researchers are familiar with Asimov's laws through popular culture, they generally consider the laws useless for many reasons, one of which is their ambiguity.[448]\n\nSeveral works use AI to force us to confront the fundamental question of what makes us human, showing us artificial beings that have the ability to feel, and thus to suffer. This appears in Karel Čapek's R. U. R., the films A. I. Artificial Intelligence and Ex Machina, as well as the novel Do Androids Dream of Electric Sheep?, by Philip K. Dick. Dick considers the idea that our understanding of human subjectivity is altered by technology created with artificial intelligence.[449]\n\n## See also\n\n• Artificial consciousness - Field in cognitive science\n\n• Artificial intelligence and elections - Impact of AI on political elections\n\n• Artificial intelligence content detection - Software to detect AI-generated content\n\n• Artificial intelligence in Wikimedia projects - Use of artificial intelligence to develop Wikipedia and other Wikimedia projects\n\n• Association for the Advancement of Artificial Intelligence (AAAI)\n\n• Behavior selection algorithm - Algorithm that selects actions for intelligent agents\n\n• Business process automation - Automation of business processes\n\n• Case-based reasoning - Process of solving new problems based on the solutions of similar past problems\n\n• Computational intelligence - Ability of a computer to learn a specific task from data or experimental observation\n\n• DARWIN EU - A European Union initiative coordinated by the European Medicines Agency (EMA) to generate and utilize real world evidence (RWE) to support the evaluation and supervision of medicines across the EU\n\n• Digital immortality - Hypothetical concept of storing a personality in digital form\n\n• Emergent algorithm - Algorithm exhibiting emergent behavior\n\n• Female gendering of AI technologies - Gender biases in digital technology\n\n• Glossary of artificial intelligence - List of concepts in artificial intelligence\n\n• Intelligence amplification - Use of information technology to augment human intelligence\n\n• Intelligent agent - Software agent which acts autonomously\n\n• Intelligent automation - Software process that combines robotic process automation and artificial intelligence\n\n• List of artificial intelligence books\n\n• List of artificial intelligence journals\n\n• List of artificial intelligence projects\n\n• Mind uploading - Hypothetical process of digitally emulating a brain\n\n• Organoid intelligence - Use of brain cells and brain organoids for intelligent computing\n\n• Pseudorandomness - Appearing random but actually being generated by a deterministic, causal process\n\n• Robotic process automation - Form of business process automation technology\n\n• The Last Day - 1967 Welsh science fiction novel\n\n• Wetware computer - Computer composed of organic material\n\n## Explanatory notes\n\n• ^ Jump up to: a b This list of intelligent traits is based on the topics covered by the major AI textbooks, including: Russell & Norvig (2021), Luger & Stubblefield (2004), Poole, Mackworth & Goebel (1998) and Nilsson (1998)\n\n• ^ Jump up to: a b This list of tools is based on the topics covered by the major AI textbooks, including: Russell & Norvig (2021), Luger & Stubblefield (2004), Poole, Mackworth & Goebel (1998) and Nilsson (1998)\n\n• ^ It is among the reasons that expert systems proved to be inefficient for capturing knowledge.[30][31]\n\n• ^\n\"Rational agent\" is general term used in economics, philosophy and theoretical artificial intelligence. It can refer to anything that directs its behavior to accomplish goals, such as a person, an animal, a corporation, a nation, or in the case of AI, a computer program.\n\n• ^ Alan Turing discussed the centrality of learning as early as 1950, in his classic paper \"Computing Machinery and Intelligence\".[42] In 1956, at the original Dartmouth AI summer conference, Ray Solomonoff wrote a report on unsupervised probabilistic machine learning: \"An Inductive Inference Machine\".[43]\n\n• ^ See AI winter § Machine translation and the ALPAC report of 1966.\n\n• ^\nCompared with symbolic logic, formal Bayesian inference is computationally expensive. For inference to be tractable, most observations must be conditionally independent of one another. AdSense uses a Bayesian network with over 300 million edges to learn which ads to serve.[94]\n\n• ^ Expectation-maximization, one of the most popular algorithms in machine learning, allows clustering in the presence of unknown latent variables.[96]\n\n• ^\nSome form of deep neural networks (without a specific learning algorithm) were described by:\nWarren S. McCulloch and Walter Pitts (1943)[117]\nAlan Turing (1948);[118]\nKarl Steinbuch and Roger David Joseph (1961).[119]\nDeep or recurrent networks that learned (or used gradient descent) were developed by:\nFrank Rosenblatt(1957);[118]\nOliver Selfridge (1959);[119]\nAlexey Ivakhnenko and Valentin Lapa (1965);[120]\nKaoru Nakano (1971);[121]\nShun-Ichi Amari (1972);[121]\nJohn Joseph Hopfield (1982).[121]\nPrecursors to backpropagation were developed by:\nHenry J. Kelley (1960);[118]\nArthur E. Bryson (1962);[118]\nStuart Dreyfus (1962);[118]\nArthur E. Bryson and Yu-Chi Ho (1969);[118]\nBackpropagation was independently developed by:\nSeppo Linnainmaa (1970);[122]\nPaul Werbos (1974).[118]\n\n• ^ Geoffrey Hinton said, of his work on neural networks in the 1990s, \"our labeled datasets were thousands of times too small. [And] our computers were millions of times too slow.\"[123]\n\n• ^ In statistics, a bias is a systematic error or deviation from the correct value. But in the context of fairness, it refers to a tendency in favor or against a certain group or individual characteristic, usually in a way that is considered unfair or harmful. A statistically unbiased AI system that produces disparate outcomes for different demographic groups may thus be viewed as biased in the ethical sense.[252]\n\n• ^ Including Jon Kleinberg (Cornell University), Sendhil Mullainathan (University of Chicago), Cynthia Chouldechova (Carnegie Mellon) and Sam Corbett-Davis (Stanford)[262]\n\n• ^ Moritz Hardt (a director at the Max Planck Institute for Intelligent Systems) argues that machine learning \"is fundamentally the wrong tool for a lot of domains, where you're trying to design interventions and mechanisms that change the world.\"[267]\n\n• ^ When the law was passed in 2018, it still contained a form of this provision.\n\n• ^ This is the United Nations' definition, and includes things like land mines as well.[283]\n\n• ^ See table 4; 9% is both the OECD average and the U. S. average.[294]\n\n• ^ Sometimes called a \"robopocalypse\"[303]\n\n• ^ \"Electronic brain\" was the term used by the press around this time.[360][362]\n\n• ^\nDaniel Crevier wrote, \"the conference is generally recognized as the official birthdate of the new science.\"[365] Russell and Norvig called the conference \"the inception of artificial intelligence.\"[117]\n\n• ^\nRussell and Norvig wrote \"for the next 20 years the field would be dominated by these people and their students.\"[366]\n\n• ^\nRussell and Norvig wrote, \"it was astonishing whenever a computer did anything kind of smartish\".[367]\n\n• ^\nThe programs described are Arthur Samuel's checkers program for the IBM 701, Daniel Bobrow's STUDENT, Newell and Simon's Logic Theorist and Terry Winograd's SHRDLU.\n\n• ^ Russell and Norvig write: \"in almost all cases, these early systems failed on more difficult problems\"[371]\n\n• ^\nEmbodied approaches to AI[378] were championed by Hans Moravec[379] and Rodney Brooks[380] and went by many names: Nouvelle AI.[380] Developmental robotics.[381]\n\n• ^ Matteo Wong wrote in The Atlantic: \"Whereas for decades, computer-science fields such as natural-language processing, computer vision, and robotics used extremely different methods, now they all use a programming method called \"deep learning\". As a result, their code and approaches have become more similar, and their models are easier to integrate into one another.\"[387]\n\n• ^ Jack Clark wrote in Bloomberg: \"After a half-decade of quiet breakthroughs in artificial intelligence, 2015 has been a landmark year. Computers are smarter and learning faster than ever\", and noted that the number of software projects that use machine learning at Google increased from a \"sporadic usage\" in 2012 to more than 2,700 projects in 2015.[389]\n\n• ^ Nils Nilsson wrote in 1983: \"Simply put, there is wide disagreement in the field about what AI is all about.\"[414]\n\n• ^\nDaniel Crevier wrote that \"time has proven the accuracy and perceptiveness of some of Dreyfus's comments. Had he formulated them less aggressively, constructive actions they suggested might have been taken much earlier.\"[419]\n\n• ^\nSearle presented this definition of \"Strong AI\" in 1999.[429] Searle's original formulation was \"The appropriately programmed computer really is a mind, in the sense that computers given the right programs can be literally said to understand and have other cognitive states.\"[430] Strong AI is defined similarly by Russell and Norvig: \"Stong AI - the assertion that machines that do so are actually thinking (as opposed to simulating thinking).\"[431]\n\n## References\n\n• ^ Jump up to: a b c Russell & Norvig (2021), pp. 1-4.\n\n• ^ AI set to exceed human brain power Archived 19 February 2008 at the Wayback Machine CNN. com (26 July 2006)\n\n• ^ Kaplan, Andreas; Haenlein, Michael (2019). \"Siri, Siri, in my hand: Who's the fairest in the land? On the interpretations, illustrations, and implications of artificial intelligence\". Business Horizons. 62: 15-25. doi:10.1016/j. bushor.2018.08.004. [the question of the source is a pastiche of: Snow White]\n\n• ^ Russell & Norvig (2021, §1.2).\n\n• ^ \"Tech companies want to build artificial general intelligence. But who decides when AGI is attained?\". AP News. 4 April 2024. Retrieved 20 May 2025.\n\n• ^ Jump up to: a b Dartmouth workshop: Russell & Norvig (2021, p. 18), McCorduck (2004, pp. 111-136), NRC (1999, pp. 200-201)\n\nThe proposal: McCarthy et al. (1955)\n\n• ^ Jump up to: a b Successful programs of the 1960s: McCorduck (2004, pp. 243-252), Crevier (1993, pp. 52-107), Moravec (1988, p. 9), Russell & Norvig (2021, pp. 19-21)\n\n• ^ Jump up to: a b Funding initiatives in the early 1980s: Fifth Generation Project (Japan), Alvey (UK), Microelectronics and Computer Technology Corporation (US), Strategic Computing Initiative (US): McCorduck (2004, pp. 426-441), Crevier (1993, pp. 161-162, 197-203, 211, 240), Russell & Norvig (2021, p. 23), NRC (1999, pp. 210-211), Newquist (1994, pp. 235-248)\n\n• ^ Jump up to: a b First AI Winter, Lighthill report, Mansfield Amendment: Crevier (1993, pp. 115-117), Russell & Norvig (2021, pp. 21-22), NRC (1999, pp. 212-213), Howe (1994), Newquist (1994, pp. 189-201)\n\n• ^ Jump up to: a b Second AI Winter: Russell & Norvig (2021, p. 24), McCorduck (2004, pp. 430-435), Crevier (1993, pp. 209-210), NRC (1999, pp. 214-216), Newquist (1994, pp. 301-318)\n\n• ^ Jump up to: a b Deep learning revolution, AlexNet: Goldman (2022), Russell & Norvig (2021, p. 26), McKinsey (2018)\n\n• ^ Toews (2023).\n\n• ^ Problem-solving, puzzle solving, game playing, and deduction: Russell & Norvig (2021, chpt. 3-5), Russell & Norvig (2021, chpt. 6) (constraint satisfaction), Poole, Mackworth & Goebel (1998, chpt. 2, 3, 7, 9), Luger & Stubblefield (2004, chpt. 3, 4, 6, 8), Nilsson (1998, chpt. 7-12)\n\n• ^ Uncertain reasoning: Russell & Norvig (2021, chpt. 12-18), Poole, Mackworth & Goebel (1998, pp. 345-395), Luger & Stubblefield (2004, pp. 333-381), Nilsson (1998, chpt. 7-12)\n\n• ^ Jump up to: a b c Intractability and efficiency and the combinatorial explosion: Russell & Norvig (2021, p. 21)\n\n• ^ Jump up to: a b c Psychological evidence of the prevalence of sub-symbolic reasoning and knowledge: Kahneman (2011), Dreyfus & Dreyfus (1986), Wason & Shapiro (1966), Kahneman, Slovic & Tversky (1982)\n\n• ^ Knowledge representation and knowledge engineering: Russell & Norvig (2021, chpt. 10), Poole, Mackworth & Goebel (1998, pp. 23-46, 69-81, 169-233, 235-277, 281-298, 319-345), Luger & Stubblefield (2004, pp. 227-243), Nilsson (1998, chpt. 17.1-17.4, 18)\n\n• ^ Smoliar & Zhang (1994).\n\n• ^ Neumann & Möller (2008).\n\n• ^ Kuperman, Reichley & Bailey (2006).\n\n• ^ McGarry (2005).\n\n• ^ Bertini, Del Bimbo & Torniai (2006).\n\n• ^ Russell & Norvig (2021), pp. 272.\n\n• ^ Representing categories and relations: Semantic networks, description logics, inheritance (including frames, and scripts): Russell & Norvig (2021, §10.2 & 10.5), Poole, Mackworth & Goebel (1998, pp. 174-177), Luger & Stubblefield (2004, pp. 248-258), Nilsson (1998, chpt. 18.3)\n\n• ^ Representing events and time: Situation calculus, event calculus, fluent calculus (including solving the frame problem): Russell & Norvig (2021, §10.3), Poole, Mackworth & Goebel (1998, pp. 281-298), Nilsson (1998, chpt. 18.2)\n\n• ^ Causal calculus: Poole, Mackworth & Goebel (1998, pp. 335-337)\n\n• ^ Representing knowledge about knowledge: Belief calculus, modal logics: Russell & Norvig (2021, §10.4), Poole, Mackworth & Goebel (1998, pp. 275-277)\n\n• ^ Jump up to: a b Default reasoning, Frame problem, default logic, non-monotonic logics, circumscription, closed world assumption, abduction: Russell & Norvig (2021, §10.6), Poole, Mackworth & Goebel (1998, pp. 248-256, 323-335), Luger & Stubblefield (2004, pp. 335-363), Nilsson (1998, ~18.3.3)\n(Poole et al. places abduction under \"default reasoning\". Luger et al. places this under \"uncertain reasoning\").\n\n• ^ Jump up to: a b Breadth of commonsense knowledge: Lenat & Guha (1989, Introduction), Crevier (1993, pp. 113-114), Moravec (1988, p. 13), Russell & Norvig (2021, pp. 241, 385, 982) (qualification problem)\n\n• ^ Newquist (1994), p. 296.\n\n• ^ Crevier (1993), pp. 204-208.\n\n• ^ Russell & Norvig (2021), p. 528.\n\n• ^ Automated planning: Russell & Norvig (2021, chpt. 11).\n\n• ^ Automated decision making, Decision theory: Russell & Norvig (2021, chpt. 16-18).\n\n• ^ Classical planning: Russell & Norvig (2021, Section 11.2).\n\n• ^ Sensorless or \"conformant\" planning, contingent planning, replanning (a. k. a. online planning): Russell & Norvig (2021, Section 11.5).\n\n• ^ Uncertain preferences: Russell & Norvig (2021, Section 16.7)\nInverse reinforcement learning: Russell & Norvig (2021, Section 22.6)\n\n• ^ Information value theory: Russell & Norvig (2021, Section 16.6).\n\n• ^ Markov decision process: Russell & Norvig (2021, chpt. 17).\n\n• ^ Game theory and multi-agent decision theory: Russell & Norvig (2021, chpt. 18).\n\n• ^ Learning: Russell & Norvig (2021, chpt. 19-22), Poole, Mackworth & Goebel (1998, pp. 397-438), Luger & Stubblefield (2004, pp. 385-542), Nilsson (1998, chpt. 3.3, 10.3, 17.5, 20)\n\n• ^ Turing (1950).\n\n• ^ Solomonoff (1956).\n\n• ^ Unsupervised learning: Russell & Norvig (2021, pp. 653) (definition), Russell & Norvig (2021, pp. 738-740) (cluster analysis), Russell & Norvig (2021, pp. 846-860) (word embedding)\n\n• ^ Jump up to: a b Supervised learning: Russell & Norvig (2021, §19.2) (Definition), Russell & Norvig (2021, Chpt. 19-20) (Techniques)\n\n• ^ Reinforcement learning: Russell & Norvig (2021, chpt. 22), Luger & Stubblefield (2004, pp. 442-449)\n\n• ^ Transfer learning: Russell & Norvig (2021, pp. 281), The Economist (2016)\n\n• ^ \"Artificial Intelligence (AI): What Is AI and How Does It Work? | Built In\". builtin. com. Retrieved 30 October 2023.\n\n• ^ Computational learning theory: Russell & Norvig (2021, pp. 672-674), Jordan & Mitchell (2015)\n\n• ^ Natural language processing (NLP): Russell & Norvig (2021, chpt. 23-24), Poole, Mackworth & Goebel (1998, pp. 91-104), Luger & Stubblefield (2004, pp. 591-632)\n\n• ^ Subproblems of NLP: Russell & Norvig (2021, pp. 849-850)\n\n• ^ Russell & Norvig (2021), pp. 856-858.\n\n• ^ Dickson (2022).\n\n• ^ Modern statistical and deep learning approaches to NLP: Russell & Norvig (2021, chpt. 24), Cambria & White (2014)\n\n• ^ Vincent (2019).\n\n• ^ Russell & Norvig (2021), pp. 875-878.\n\n• ^ Bushwick (2023).\n\n• ^ Computer vision: Russell & Norvig (2021, chpt. 25), Nilsson (1998, chpt. 6)\n\n• ^ Russell & Norvig (2021), pp. 849-850.\n\n• ^ Russell & Norvig (2021), pp. 895-899.\n\n• ^ Russell & Norvig (2021), pp. 899-901.\n\n• ^ Challa et al. (2011).\n\n• ^ Russell & Norvig (2021), pp. 931-938.\n\n• ^ MIT AIL (2014).\n\n• ^ Affective computing: Thro (1993), Edelson (1991), Tao & Tan (2005), Scassellati (2002)\n\n• ^ Waddell (2018).\n\n• ^ Poria et al. (2017).\n\n• ^ Jump up to: a b\nArtificial general intelligence: Russell & Norvig (2021, pp. 32-33, 1020-1021)\n\nProposal for the modern version: Pennachin & Goertzel (2007)\n\nWarnings of overspecialization in AI from leading researchers: Nilsson (1995), McCarthy (2007), Beal & Winston (2009)\n\n• ^ Search algorithms: Russell & Norvig (2021, chpts. 3-5), Poole, Mackworth & Goebel (1998, pp. 113-163), Luger & Stubblefield (2004, pp. 79-164, 193-219), Nilsson (1998, chpts. 7-12)\n\n• ^ State space search: Russell & Norvig (2021, chpt. 3)\n\n• ^ Russell & Norvig (2021), sect. 11.2.\n\n• ^ Uninformed searches (breadth first search, depth-first search and general state space search): Russell & Norvig (2021, sect. 3.4), Poole, Mackworth & Goebel (1998, pp. 113-132), Luger & Stubblefield (2004, pp. 79-121), Nilsson (1998, chpt. 8)\n\n• ^ Heuristic or informed searches (e. g., greedy best first and A*): Russell & Norvig (2021, sect. 3.5), Poole, Mackworth & Goebel (1998, pp. 132-147), Poole & Mackworth (2017, sect. 3.6), Luger & Stubblefield (2004, pp. 133-150)\n\n• ^ Adversarial search: Russell & Norvig (2021, chpt. 5)\n\n• ^ Local or \"optimization\" search: Russell & Norvig (2021, chpt. 4)\n\n• ^ Singh Chauhan, Nagesh (18 December 2020). \"Optimization Algorithms in Neural Networks\". KDnuggets. Retrieved 13 January 2024.\n\n• ^ Evolutionary computation: Russell & Norvig (2021, sect. 4.1.2)\n\n• ^ Merkle & Middendorf (2013).\n\n• ^ Logic: Russell & Norvig (2021, chpts. 6-9), Luger & Stubblefield (2004, pp. 35-77), Nilsson (1998, chpt. 13-16)\n\n• ^ Propositional logic: Russell & Norvig (2021, chpt. 6), Luger & Stubblefield (2004, pp. 45-50), Nilsson (1998, chpt. 13)\n\n• ^ First-order logic and features such as equality: Russell & Norvig (2021, chpt. 7), Poole, Mackworth & Goebel (1998, pp. 268-275), Luger & Stubblefield (2004, pp. 50-62), Nilsson (1998, chpt. 15)\n\n• ^ Logical inference: Russell & Norvig (2021, chpt. 10)\n\n• ^ logical deduction as search: Russell & Norvig (2021, sects. 9.3, 9.4), Poole, Mackworth & Goebel (1998, pp. ~46-52), Luger & Stubblefield (2004, pp. 62-73), Nilsson (1998, chpt. 4.2, 7.2)\n\n• ^ Resolution and unification: Russell & Norvig (2021, sections 7.5.2, 9.2, 9.5)\n\n• ^ Warren, D. H.; Pereira, L. M.; Pereira, F. (1977). \"Prolog-the language and its implementation compared with Lisp\". ACM SIGPLAN Notices. 12 (8): 109-115. doi:10.1145/872734.806939.\n\n• ^ Fuzzy logic: Russell & Norvig (2021, pp. 214, 255, 459), Scientific American (1999)\n\n• ^ Jump up to: a b Stochastic methods for uncertain reasoning: Russell & Norvig (2021, chpt. 12-18, 20), Poole, Mackworth & Goebel (1998, pp. 345-395), Luger & Stubblefield (2004, pp. 165-191, 333-381), Nilsson (1998, chpt. 19)\n\n• ^ decision theory and decision analysis: Russell & Norvig (2021, chpt. 16-18), Poole, Mackworth & Goebel (1998, pp. 381-394)\n\n• ^ Information value theory: Russell & Norvig (2021, sect. 16.6)\n\n• ^ Markov decision processes and dynamic decision networks: Russell & Norvig (2021, chpt. 17)\n\n• ^ Jump up to: a b c Stochastic temporal models: Russell & Norvig (2021, chpt. 14)\nHidden Markov model: Russell & Norvig (2021, sect. 14.3)\nKalman filters: Russell & Norvig (2021, sect. 14.4)\nDynamic Bayesian networks: Russell & Norvig (2021, sect. 14.5)\n\n• ^ Game theory and mechanism design: Russell & Norvig (2021, chpt. 18)\n\n• ^ Bayesian networks: Russell & Norvig (2021, sects. 12.5-12.6, 13.4-13.5, 14.3-14.5, 16.5, 20.2-20.3), Poole, Mackworth & Goebel (1998, pp. 361-381), Luger & Stubblefield (2004, pp. ~182-190, ≈363-379), Nilsson (1998, chpt. 19.3-19.4)\n\n• ^ Domingos (2015), chpt. 6.\n\n• ^ Bayesian inference algorithm: Russell & Norvig (2021, sect. 13.3-13.5), Poole, Mackworth & Goebel (1998, pp. 361-381), Luger & Stubblefield (2004, pp. ~363-379), Nilsson (1998, chpt. 19.4 & 7)\n\n• ^ Domingos (2015), p. 210.\n\n• ^ Bayesian learning and the expectation-maximization algorithm: Russell & Norvig (2021, chpt. 20), Poole, Mackworth & Goebel (1998, pp. 424-433), Nilsson (1998, chpt. 20), Domingos (2015, p. 210)\n\n• ^ Bayesian decision theory and Bayesian decision networks: Russell & Norvig (2021, sect. 16.5)\n\n• ^ Statistical learning methods and classifiers: Russell & Norvig (2021, chpt. 20),\n\n• ^ Ciaramella, Alberto; Ciaramella, Marco (2024). Introduction to Artificial Intelligence: from data analysis to generative AI. Intellisemantic Editions. ISBN 978-8-8947-8760-3.\n\n• ^ Decision trees: Russell & Norvig (2021, sect. 19.3), Domingos (2015, p. 88)\n\n• ^ Non-parameteric learning models such as K-nearest neighbor and support vector machines: Russell & Norvig (2021, sect. 19.7), Domingos (2015, p. 187) (k-nearest neighbor)\n\n• Domingos (2015, p. 88) (kernel methods)\n\n• ^ Domingos (2015), p. 152.\n\n• ^ Naive Bayes classifier: Russell & Norvig (2021, sect. 12.6), Domingos (2015, p. 152)\n\n• ^ Jump up to: a b Neural networks: Russell & Norvig (2021, chpt. 21), Domingos (2015, Chapter 4)\n\n• ^ Gradient calculation in computational graphs, backpropagation, automatic differentiation: Russell & Norvig (2021, sect. 21.2), Luger & Stubblefield (2004, pp. 467-474), Nilsson (1998, chpt. 3.3)\n\n• ^ Universal approximation theorem: Russell & Norvig (2021, p. 752)\nThe theorem: Cybenko (1988), Hornik, Stinchcombe & White (1989)\n\n• ^ Feedforward neural networks: Russell & Norvig (2021, sect. 21.1)\n\n• ^ Perceptrons: Russell & Norvig (2021, pp. 21, 22, 683, 22)\n\n• ^ Jump up to: a b Deep learning: Russell & Norvig (2021, chpt. 21), Goodfellow, Bengio & Courville (2016), Hinton et al. (2016), Schmidhuber (2015)\n\n• ^ Recurrent neural networks: Russell & Norvig (2021, sect. 21.6)\n\n• ^ Convolutional neural networks: Russell & Norvig (2021, sect. 21.3)\n\n• ^ Sindhu V, Nivedha S, Prakash M (February 2020). \"An Empirical Science Research on Bioinformatics in Machine Learning\". Journal of Mechanics of Continua and Mathematical Sciences (7). doi:10.26782/jmcms. spl.7/2020.02.00006.\n\n• ^ Deng & Yu (2014), pp. 199-200.\n\n• ^ Ciresan, Meier & Schmidhuber (2012).\n\n• ^ Russell & Norvig (2021), p. 750.\n\n• ^ Jump up to: a b c Russell & Norvig (2021), p. 17.\n\n• ^ Jump up to: a b c d e f g Russell & Norvig (2021), p. 785.\n\n• ^ Jump up to: a b Schmidhuber (2022), sect. 5.\n\n• ^ Schmidhuber (2022), sect. 6.\n\n• ^ Jump up to: a b c Schmidhuber (2022), sect. 7.\n\n• ^ Schmidhuber (2022), sect. 8.\n\n• ^ Quoted in Christian (2020, p. 22)\n\n• ^ Metz, Cade; Weise, Karen (5 May 2025). \"A. I. Hallucinations Are Getting Worse, Even as New Systems Become More Powerful\". The New York Times. ISSN 0362-4331. Retrieved 6 May 2025.\n\n• ^ Smith (2023).\n\n• ^ \"Explained: Generative AI\". MIT News | Massachusetts Institute of Technology. 9 November 2023.\n\n• ^ \"AI Writing and Content Creation Tools\". MIT Sloan Teaching & Learning Technologies. Archived from the original on 25 December 2023. Retrieved 25 December 2023.\n\n• ^ Marmouyet (2023).\n\n• ^ Kobielus (2019).\n\n• ^ Thomason, James (21 May 2024). \"Mojo Rising: The resurgence of AI-first programming languages\". VentureBeat. Archived from the original on 27 June 2024. Retrieved 26 May 2024.\n\n• ^ Wodecki, Ben (5 May 2023). \"7 AI Programming Languages You Need to Know\". AI Business. Archived from the original on 25 July 2024. Retrieved 5 October 2024.\n\n• ^ Plumb, Taryn (18 September 2024). \"Why Jensen Huang and Marc Benioff see 'gigantic' opportunity for agentic AI\". VentureBeat. Archived from the original on 5 October 2024. Retrieved 4 October 2024.\n\n• ^ Mims, Christopher (19 September 2020). \"Huang's Law Is the New Moore's Law, and Explains Why Nvidia Wants Arm\". Wall Street Journal. ISSN 0099-9660. Archived from the original on 2 October 2023. Retrieved 19 January 2025.\n\n• ^ Dankwa-Mullan, Irene (2024). \"Health Equity and Ethical Considerations in Using Artificial Intelligence in Public Health and Medicine\". Preventing Chronic Disease. 21 240245: E64. doi:10.5888/pcd21.240245. ISSN 1545-1151. PMC 11364282. PMID 39173183.\n\n• ^ Jumper, J; Evans, R; Pritzel, A (2021). \"Highly accurate protein structure prediction with AlphaFold\". Nature. 596 (7873): 583-589. Bibcode:2021Natur.596..583J. doi:10.1038/s41586-021-03819-2. PMC 8371605. PMID 34265844.\n\n• ^ \"AI discovers new class of antibiotics to kill drug-resistant bacteria\". New Scientist. 20 December 2023. Archived from the original on 16 September 2024. Retrieved 5 October 2024.\n\n• ^ \"AI speeds up drug design for Parkinson's ten-fold\". University of Cambridge. Cambridge University. 17 April 2024. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ Horne, Robert I.; Andrzejewska, Ewa A.; Alam, Parvez; Brotzakis, Z. Faidon; Srivastava, Ankit; Aubert, Alice; Nowinska, Magdalena; Gregory, Rebecca C.; Staats, Roxine; Possenti, Andrea; Chia, Sean; Sormanni, Pietro; Ghetti, Bernardino; Caughey, Byron; Knowles, Tuomas P. J.; Vendruscolo, Michele (17 April 2024). \"Discovery of potent inhibitors of α-synuclein aggregation using structure-based iterative learning\". Nature Chemical Biology. 20 (5). Nature: 634-645. doi:10.1038/s41589-024-01580-x. PMC 11062903. PMID 38632492.\n\n• ^ Grant, Eugene F.; Lardner, Rex (25 July 1952). \"The Talk of the Town - It\". The New Yorker. ISSN 0028-792X. Archived from the original on 16 February 2020. Retrieved 28 January 2024.\n\n• ^ Anderson, Mark Robert (11 May 2017). \"Twenty years on from Deep Blue vs Kasparov: how a chess match started the big data revolution\". The Conversation. Archived from the original on 17 September 2024. Retrieved 28 January 2024.\n\n• ^ Markoff, John (16 February 2011). \"Computer Wins on 'Jeopardy!': Trivial, It's Not\". The New York Times. ISSN 0362-4331. Archived from the original on 22 October 2014. Retrieved 28 January 2024.\n\n• ^ Byford, Sam (27 May 2017). \"AlphaGo retires from competitive Go after defeating world number one 3-0\". The Verge. Archived from the original on 7 June 2017. Retrieved 28 January 2024.\n\n• ^ Brown, Noam; Sandholm, Tuomas (30 August 2019). \"Superhuman AI for multiplayer poker\". Science. 365 (6456): 885-890. Bibcode:2019Sci...365..885B. doi:10.1126/science. aay2400. PMID 31296650.\n\n• ^ \"MuZero: Mastering Go, chess, shogi and Atari without rules\". Google DeepMind. 23 December 2020. Retrieved 28 January 2024.\n\n• ^ Sample, Ian (30 October 2019). \"AI becomes grandmaster in 'fiendishly complex' StarCraft II\". The Guardian. ISSN 0261-3077. Archived from the original on 29 December 2020. Retrieved 28 January 2024.\n\n• ^ Wurman, P. R.; Barrett, S.; Kawamoto, K. (2022). \"Outracing champion Gran Turismo drivers with deep reinforcement learning\" (PDF). Nature. 602 (7896): 223-228. Bibcode:2022Natur.602..223W. doi:10.1038/s41586-021-04357-7. PMID 35140384.\n\n• ^ Wilkins, Alex (13 March 2024). \"Google AI learns to play open-world video games by watching them\". New Scientist. Archived from the original on 26 July 2024. Retrieved 21 July 2024.\n\n• ^ Wu, Zhengxuan; Arora, Aryaman; Wang, Zheng; Geiger, Atticus; Jurafsky, Dan; Manning, Christopher D.; Potts, Christopher (2024). \"ReFT: Representation Finetuning for Language Models\". NeurIPS. arXiv:2404.03592.\n\n• ^ \"Improving mathematical reasoning with process supervision\". OpenAI. 31 May 2023. Retrieved 26 January 2025.\n\n• ^ Srivastava, Saurabh (29 February 2024). \"Functional Benchmarks for Robust Evaluation of Reasoning Performance, and the Reasoning Gap\". arXiv:2402.19450 [cs. AI].\n\n• ^ Lightman, Hunter; Kosaraju, Vineet; Burda, Yura; Edwards, Harri; Baker, Bowen; Lee, Teddy; Leike, Jan; Schulman, John; Sutskever, Ilya; Cobbe, Karl (2023). \"Let's Verify Step by Step\". arXiv:2305.20050v1 [cs. LG].\n\n• ^ Franzen, Carl (8 August 2024). \"Alibaba claims no. 1 spot in AI math models with Qwen2-Math\". VentureBeat. Retrieved 16 February 2025.\n\n• ^ Franzen, Carl (9 January 2025). \"Microsoft's new rStar-Math technique upgrades small models to outperform OpenAI's o1-preview at math problems\". VentureBeat. Retrieved 26 January 2025.\n\n• ^ Gina Genkina: New AI Model Advances the \"Kissing Problem\" and More. AlphaEvolve made several mathematical discoveries and practical optimizations IEEE Spectrum 14 May 2025. Retrieved 7 June 2025\n\n• ^ Roberts, Siobhan (25 July 2024). \"AI achieves silver-medal standard solving International Mathematical Olympiad problems\". The New York Times. Archived from the original on 26 September 2024. Retrieved 7 August 2024.\n\n• ^ Azerbayev, Zhangir; Schoelkopf, Hailey; Paster, Keiran; Santos, Marco Dos; McAleer', Stephen; Jiang, Albert Q.; Deng, Jia; Biderman, Stella; Welleck, Sean (16 October 2023). \"Llemma: An Open Language Model For Mathematics\". EleutherAI Blog. Retrieved 26 January 2025.\n\n• ^ \"Julius AI\". julius. ai.\n\n• ^ Metz, Cade (21 July 2025). \"Google A. I. System Wins Gold Medal in International Math Olympiad\". The New York Times. ISSN 0362-4331. Retrieved 24 July 2025.\n\n• ^ McFarland, Alex (12 July 2024). \"8 Best AI for Math Tools (January 2025)\". Unite. AI. Retrieved 26 January 2025.\n\n• ^ Matthew Finio & Amanda Downie: IBM Think 2024 Primer, \"What is Artificial Intelligence (AI) in Finance?\" 8 December 2023\n\n• ^ M. Nicolas, J. Firzli: Pensions Age / European Pensions magazine, \"Artificial Intelligence: Ask the Industry\", May-June 2024. https://videovoice. org/ai-in-finance-innovation-entrepreneurship-vs-over-regulation-with-the-eus-artificial-intelligence-act-wont-work-as-intended/ Archived 11 September 2024 at the Wayback Machine.\n\n• ^ Jump up to: a b c Congressional Research Service (2019). Artificial Intelligence and National Security (PDF). Washington, DC: Congressional Research Service. Archived (PDF) from the original on 8 May 2020. Retrieved 25 February 2024. PD-notice\n\n• ^ Jump up to: a b Slyusar, Vadym (2019). Artificial intelligence as the basis of future control networks (Preprint). doi:10.13140/RG.2.2.30247.50087.\n\n• ^ Iraqi, Amjad (3 April 2024). \"'Lavender': The AI machine directing Israel's bombing spree in Gaza\". +972 Magazine. Archived from the original on 10 October 2024. Retrieved 6 April 2024.\n\n• ^ Davies, Harry; McKernan, Bethan; Sabbagh, Dan (1 December 2023). \"'The Gospel': how Israel uses AI to select bombing targets in Gaza\". The Guardian. Archived from the original on 6 December 2023. Retrieved 4 December 2023.\n\n• ^ Marti, J Werner (10 August 2024). \"Drohnen haben den Krieg in der Ukraine revolutioniert, doch sie sind empfindlich auf Störsender - deshalb sollen sie jetzt autonom operieren\". Neue Zürcher Zeitung (in German). Archived from the original on 10 August 2024. Retrieved 10 August 2024.\n\n• ^ Banh, Leonardo; Strobel, Gero (2023). \"Generative artificial intelligence\". Electronic Markets. 33 (1) 63. doi:10.1007/s12525-023-00680-1.\n\n• ^ Pasick, Adam (27 March 2023). \"Artificial Intelligence Glossary: Neural Networks and Other Terms Explained\". The New York Times. ISSN 0362-4331. Archived from the original on 1 September 2023. Retrieved 22 April 2023.\n\n• ^ Griffith, Erin; Metz, Cade (27 January 2023). \"Anthropic Said to Be Closing In on $300 Million in New A. I. Funding\". The New York Times. Archived from the original on 9 December 2023. Retrieved 14 March 2023.\n\n• ^ Lanxon, Nate; Bass, Dina; Davalos, Jackie (10 March 2023). \"A Cheat Sheet to AI Buzzwords and Their Meanings\". Bloomberg News. Archived from the original on 17 November 2023. Retrieved 14 March 2023.\n\n• ^ Roose, Kevin (21 October 2022). \"A Coming-Out Party for Generative A. I., Silicon Valley's New Craze\". The New York Times. Archived from the original on 15 February 2023. Retrieved 14 March 2023.\n\n• ^ Shahaf, Tal; Shahaf, Tal (23 October 2025). \"Lightricks unveils powerful AI video model challenging OpenAI and Google\". Ynetglobal. Retrieved 22 December 2025.\n\n• ^ Metz, Cade (15 February 2024). \"OpenAI Unveils A. I. That Instantly Generates Eye-Popping Videos\". The New York Times. ISSN 0362-4331. Archived from the original on 15 February 2024. Retrieved 16 February 2024.\n\n• ^ Raza, Marium M.; Venkatesh, Kaushik P.; Kvedar, Joseph C. (7 March 2024). \"Generative AI and large language models in health care: pathways to implementation\". npj Digital Medicine. 7 (1): 62. doi:10.1038/s41746-023-00988-4. ISSN 2398-6352. PMC 10920625. PMID 38454007.\n\n• ^ Mogaji, Emmanuel (7 January 2025). \"How generative AI is transforming financial services - and what it means for customers\". The Conversation. Retrieved 10 April 2025.\n\n• ^ Bean, Thomas H. Davenport and Randy (19 June 2023). \"The Impact of Generative AI on Hollywood and Entertainment\". MIT Sloan Management Review. Archived from the original on 6 August 2024. Retrieved 10 April 2025.\n\n• ^ Brynjolfsson, Erik; Li, Danielle; Raymond, Lindsey R. (April 2023), Generative AI at Work (Working Paper), Working Paper Series, doi:10.3386/w31161, archived from the original on 28 March 2024, retrieved 21 January 2024\n\n• ^ \"Don't fear an AI-induced jobs apocalypse just yet\". The Economist. 6 March 2023. Archived from the original on 17 November 2023. Retrieved 14 March 2023.\n\n• ^ Coyle, Jake (27 September 2023). \"In Hollywood writers' battle against AI, humans win (for now)\". AP News. Associated Press. Archived from the original on 3 April 2024. Retrieved 26 January 2024.\n\n• ^ \"How Generative AI Can Augment Human Creativity\". Harvard Business Review. 16 June 2023. ISSN 0017-8012. Archived from the original on 20 June 2023. Retrieved 20 June 2023.\n\n• ^ Poole, David; Mackworth, Alan (2023). Artificial Intelligence, Foundations of Computational Agents (3rd ed.). Cambridge University Press. doi:10.1017/9781009258227. ISBN 978-1-0092-5819-7.\n\n• ^ Russell, Stuart; Norvig, Peter (2020). Artificial Intelligence: A Modern Approach (4th ed.). Pearson. ISBN 978-0-1346-1099-3.\n\n• ^ \"Why agents are the next frontier of generative AI\". McKinsey Digital. 24 July 2024. Archived from the original on 3 October 2024. Retrieved 10 August 2024.\n\n• ^ \"Introducing Copilot Search in Bing\". blogs. bing. com. 4 April 2025.\n\n• ^ Peters, Jay (14 March 2023). \"The Bing AI bot has been secretly running GPT-4\". The Verge. Retrieved 31 August 2025.\n\n• ^ \"Security for Microsoft 365 Copilot\". learn. microsoft. com.\n\n• ^ O'Flaherty, Kate (21 May 2025). \"Google AI Overviews - Everything You Need To Know\". Forbes.\n\n• ^ \"Generative AI in Search: Let Google do the searching for you\". Google. 14 May 2024.\n\n• ^ Figueiredo, Mayara Costa; Ankrah, Elizabeth; Powell, Jacquelyn E.; Epstein, Daniel A.; Chen, Yunan (12 January 2024). \"Powered by AI: Examining How AI Descriptions Influence Perceptions of Fertility Tracking Applications\". Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies. 7 (4): 1-24. doi:10.1145/3631414.\n\n• ^ Power, Jennifer; Pym, Tinonee; James, Alexandra; Waling, Andrea (5 July 2024). \"Smart Sex Toys: A Narrative Review of Recent Research on Cultural, Health and Safety Considerations\". Current Sexual Health Reports. 16 (3): 199-215. doi:10.1007/s11930-024-00392-3. ISSN 1548-3592.\n\n• ^ Marcantonio, Tiffany L.; Avery, Gracie; Thrash, Anna; Leone, Ruschelle M. (10 September 2024). \"Large Language Models in an App: Conducting a Qualitative Synthetic Data Analysis of How Snapchat's 'My AI' Responds to Questions About Sexual Consent, Sexual Refusals, Sexual Assault, and Sexting\". The Journal of Sex Research. 62 (9): 1905-1919. doi:10.1080/00224499.2024.2396457. PMC 11891083. PMID 39254628.\n\n• ^ Hanson, Kenneth R.; Bolthouse, Hannah (2024). \"\"Replika Removing Erotic Role-Play Is Like Grand Theft Auto Removing Guns or Cars\": Reddit Discourse on Artificial Intelligence Chatbots and Sexual Technologies\". Socius: Sociological Research for a Dynamic World. 10 23780231241259627. doi:10.1177/23780231241259627. ISSN 2378-0231.\n\n• ^ Mania, Karolina (2024). \"Legal Protection of Revenge and Deepfake Porn Victims in the European Union: Findings from a Comparative Legal Study\". Trauma, Violence, & Abuse. 25 (1): 117-129. doi:10.1177/15248380221143772. PMID 36565267.\n\n• ^ Singh, Suyesha; Nambiar, Vaishnavi (2024). \"Role of Artificial Intelligence in the Prevention of Online Child Sexual Abuse: A Systematic Review of Literature\". Journal of Applied Security Research. 19 (4): 586-627. doi:10.1080/19361610.2024.2331885.\n\n• ^ Razi, Afsaneh; Kim, Seunghyun; Alsoubai, Ashwaq; Stringhini, Gianluca; Solorio, Thamar; De Choudhury, Munmun; Wisniewski, Pamela J. (13 October 2021). \"A Human-Centered Systematic Literature Review of the Computational Approaches for Online Sexual Risk Detection\". Proceedings of the ACM on Human-Computer Interaction. 5 (CSCW2): 1-38. doi:10.1145/3479609.\n\n• ^ Ransbotham, Sam; Kiron, David; Gerbert, Philipp; Reeves, Martin (6 September 2017). \"Reshaping Business With Artificial Intelligence\". MIT Sloan Management Review. Archived from the original on 13 February 2024.\n\n• ^ Sun, Yuran; Zhao, Xilei; Lovreglio, Ruggiero; Kuligowski, Erica (2024). \"AI for large-scale evacuation modeling: Promises and challenges\". Interpretable Machine Learning for the Analysis, Design, Assessment, and Informed Decision Making for Civil Infrastructure. pp. 185-204. doi:10.1016/B978-0-12-824073-1.00014-9. ISBN 978-0-12-824073-1.\n\n• ^ Gomaa, Islam; Adelzadeh, Masoud; Gwynne, Steven; Spencer, Bruce; Ko, Yoon; Bénichou, Noureddine; Ma, Chunyun; Elsagan, Nour; Duong, Dana; Zalok, Ehab; Kinateder, Max (1 November 2021). \"A Framework for Intelligent Fire Detection and Evacuation System\". Fire Technology. 57 (6): 3179-3185. doi:10.1007/s10694-021-01157-3.\n\n• ^ Zhao, Xilei; Lovreglio, Ruggiero; Nilsson, Daniel (1 May 2020). \"Modelling and interpreting pre-evacuation decision-making using machine learning\". Automation in Construction. 113 103140. doi:10.1016/j. autcon.2020.103140. hdl:10179/17315.\n\n• ^ \"India's latest election embraced AI technology. Here are some ways it was used constructively\". PBS News. 12 June 2024. Archived from the original on 17 September 2024. Retrieved 28 October 2024.\n\n• ^ \"Экономист Дарон Асемоглу написал книгу об угрозах искусственного интеллекта - и о том, как правильное управление может обратить его на пользу человечеству Спецкор \"Медузы\" Маргарита Лютова узнала у ученого, как скоро мир сможет приблизиться к этой утопии\". Meduza (in Russian). Archived from the original on 20 June 2023. Retrieved 21 June 2023.\n\n• ^ \"Learning, thinking, artistic collaboration and other such human endeavours in the age of AI\". The Hindu. 2 June 2023. Archived from the original on 21 June 2023. Retrieved 21 June 2023.\n\n• ^ Müller, Vincent C. (30 April 2020). \"Ethics of Artificial Intelligence and Robotics\". Stanford Encyclopedia of Philosophy Archive. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ Simonite (2016).\n\n• ^ Russell & Norvig (2021), p. 987.\n\n• ^ \"Assessing potential future artificial intelligence risks, benefits and policy imperatives\". OECD. 14 November 2024. Retrieved 1 August 2025.\n\n• ^ Laskowski (2023).\n\n• ^ GAO (2022).\n\n• ^ Valinsky (2019).\n\n• ^ Russell & Norvig (2021), p. 991.\n\n• ^ Russell & Norvig (2021), pp. 991-992.\n\n• ^ Christian (2020), p. 63.\n\n• ^ Vincent (2022).\n\n• ^ Kopel, Matthew. \"Copyright Services: Fair Use\". Cornell University Library. Archived from the original on 26 September 2024. Retrieved 26 April 2024.\n\n• ^ Burgess, Matt. \"How to Stop Your Data From Being Used to Train AI\". Wired. ISSN 1059-1028. Archived from the original on 3 October 2024. Retrieved 26 April 2024.\n\n• ^ \"Exclusive: Multiple AI companies bypassing web standard to scrape publisher sites, licensing firm says\". Reuters. Archived from the original on 10 November 2024. Retrieved 13 November 2025.\n\n• ^ Shilov, Anton (21 June 2024). \"Several AI companies said to be ignoring robots dot txt exclusion, scraping content without permission: report\". Tom's Hardware. Retrieved 13 November 2025.\n\n• ^ Reisner (2023).\n\n• ^ Alter & Harris (2023).\n\n• ^ \"Getting the Innovation Ecosystem Ready for AI. An IP policy toolkit\" (PDF). WIPO.\n\n• ^ Hammond, George (27 December 2023). \"Big Tech is spending more than VC firms on AI startups\". Ars Technica. Archived from the original on 10 January 2024.\n\n• ^ Wong, Matteo (24 October 2023). \"The Future of AI Is GOMA\". The Atlantic. Archived from the original on 5 January 2024.\n\n• ^ \"Big tech and the pursuit of AI dominance\". The Economist. 26 March 2023. Archived from the original on 29 December 2023.\n\n• ^ Fung, Brian (19 December 2023). \"Where the battle to dominate AI may be won\". CNN Business. Archived from the original on 13 January 2024.\n\n• ^ Metz, Cade (5 July 2023). \"In the Age of A. I., Tech's Little Guys Need Big Friends\". The New York Times. Archived from the original on 8 July 2024. Retrieved 5 October 2024.\n\n• ^ Bhattarai, Abha; Lerman, Rachel (25 December 2025). \"10 charts that show where the economy is heading / 3. AI related investments\". The Washington Post. Archived from the original on 27 December 2025. Source: MSCI\n\n• ^ \"Electricity 2024 - Analysis\". IEA. 24 January 2024. Retrieved 13 July 2024.\n\n• ^ Calvert, Brian (28 March 2024). \"AI already uses as much energy as a small country. It's only the beginning\". Vox. New York, New York. Archived from the original on 3 July 2024. Retrieved 5 October 2024.\n\n• ^ Halper, Evan; O'Donovan, Caroline (21 June 2024). \"AI is exhausting the power grid. Tech firms are seeking a miracle solution\". Washington Post.\n\n• ^ Davenport, Carly. \"AI Data Centers and the Coming YS Power Demand Surge\" (PDF). Goldman Sachs. Archived from the original (PDF) on 26 July 2024. Retrieved 5 October 2024.\n\n• ^ Ryan, Carol (12 April 2024). \"Energy-Guzzling AI Is Also the Future of Energy Savings\". Wall Street Journal. Dow Jones.\n\n• ^ Hiller, Jennifer (1 July 2024). \"Tech Industry Wants to Lock Up Nuclear Power for AI\". Wall Street Journal. Dow Jones. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ Kendall, Tyler (28 September 2024). \"Nvidia's Huang Says Nuclear Power an Option to Feed Data Centers\". Bloomberg.\n\n• ^ Halper, Evan (20 September 2024). \"Microsoft deal would reopen Three Mile Island nuclear plant to power AI\". Washington Post.\n\n• ^ Hiller, Jennifer (20 September 2024). \"Three Mile Island's Nuclear Plant to Reopen, Help Power Microsoft's AI Centers\". Wall Street Journal. Dow Jones. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ Jump up to: a b c Niva Yadav (19 August 2024). \"Taiwan to stop large data centers in the North, cites insufficient power\". DatacenterDynamics. Archived from the original on 8 November 2024. Retrieved 7 November 2024.\n\n• ^ Jump up to: a b Mochizuki, Takashi; Oda, Shoko (18 October 2024). \"エヌビディア出資の日本企業、原発近くでΑIデータセンター新設検討\". Bloomberg (in Japanese). Archived from the original on 8 November 2024. Retrieved 7 November 2024.\n\n• ^ Jump up to: a b Naureen S Malik and Will Wade (5 November 2024). \"Nuclear-Hungry AI Campuses Need New Plan to Find Power Fast\". Bloomberg.\n\n• ^ \"Energy and AI Executive summary\". International Energy Agency. Retrieved 10 April 2025.\n\n• ^ Nicas (2018).\n\n• ^ Rainie, Lee; Keeter, Scott; Perrin, Andrew (22 July 2019). \"Trust and Distrust in America\". Pew Research Center. Archived from the original on 22 February 2024.\n\n• ^ Kosoff, Maya (8 February 2018). \"YouTube Struggles to Contain Its Conspiracy Problem\". Vanity Fair. Retrieved 10 April 2025.\n\n• ^ Berry, David M. (19 March 2025). \"Synthetic media and computational capitalism: towards a critical theory of artificial intelligence\". AI & Society. 40 (7): 5257-5269. doi:10.1007/s00146-025-02265-2. ISSN 1435-5655.\n\n• ^ \"Unreal: A quantum leap in AI video\". The Week. 17 June 2025. Retrieved 20 June 2025.\n\n• ^ Snow, Jackie (16 June 2025). \"AI video is getting real. Beware what comes next\". Quartz. Retrieved 20 June 2025.\n\n• ^ Chow, Andrew R.; Perrigo, Billy (3 June 2025). \"Google's New AI Tool Generates Convincing Deepfakes of Riots, Conflict, and Election Fraud\". Time. Retrieved 20 June 2025.\n\n• ^ Williams (2023).\n\n• ^ Olanipekun, Samson Olufemi (2025). \"Computational propaganda and misinformation: AI technologies as tools of media manipulation\". World Journal of Advanced Research and Reviews. 25 (1): 911-923. doi:10.30574/wjarr.2025.25.1.0131. ISSN 2581-9615.\n\n• ^ Taylor & Hern (2023).\n\n• ^ Lin, Hause; Czarnek, Gabriela; Lewis, Benjamin; White, Joshua P.; Berinsky, Adam J.; Costello, Thomas; Pennycook, Gordon; Rand, David G. (2025). \"Persuading voters using human-artificial intelligence dialogues\". Nature. 648 (8093): 394-401. Bibcode:2025Natur.648..394L. doi:10.1038/s41586-025-09771-9. PMID 41345316.\n\n• ^ \"To fight AI, we need 'personhood credentials,' say AI firms\". Archived from the original on 24 April 2025. Retrieved 9 May 2025.\n\n• ^ Jump up to: a b Samuel, Sigal (19 April 2022). \"Why it's so damn hard to make AI fair and unbiased\". Vox. Archived from the original on 5 October 2024. Retrieved 24 July 2024.\n\n• ^ Jump up to: a b Rose (2023).\n\n• ^ CNA (2019).\n\n• ^ Mazeika, Mantas; Yin, Xuwang; Tamirisa, Rishub; Lim, Jaehyuk; Lee, Bruce W.; Ren, Richard; Phan, Long; Mu, Norman; Khoja, Adam (2025), Utility Engineering: Analyzing and Controlling Emergent Value Systems in AIs, Figure 16, arXiv:2502.08640\n\n• ^ Goffrey (2008), p. 17.\n\n• ^ Berdahl et al. (2023); Goffrey (2008, p. 17); Rose (2023); Russell & Norvig (2021, p. 995)\n\n• ^ Christian (2020), p. 25.\n\n• ^ Jump up to: a b Russell & Norvig (2021), p. 995.\n\n• ^ Grant & Hill (2023).\n\n• ^ Larson & Angwin (2016).\n\n• ^ Christian (2020), p. 67-70.\n\n• ^ Christian (2020, pp. 67-70); Russell & Norvig (2021, pp. 993-994)\n\n• ^ Russell & Norvig (2021, p. 995); Lipartito (2011, p. 36); Goodman & Flaxman (2017, p. 6); Christian (2020, pp. 39-40, 65)\n\n• ^ Quoted in Christian (2020, p. 65).\n\n• ^ Russell & Norvig (2021, p. 994); Christian (2020, pp. 40, 80-81)\n\n• ^ Quoted in Christian (2020, p. 80)\n\n• ^ Hundt, Andrew; Agnew, William; Zeng, Vicky; Kacianka, Severin; Gombolay, Matthew (21-24 June 2022). \"Robots Enact Malignant Stereotypes\". Proceedings of the 2022 ACM Conference on Fairness, Accountability, and Transparency (FAccT '22). Seoul, South Korea: Association for Computing Machinery. doi:10.1145/3531146.3533138.\n\n• ^ For accessible summaries, see the Georgia Tech release and ScienceDaily coverage of the study's findings.\"Flawed AI Makes Robots Racist, Sexist\". Georgia Tech Research News. 23 June 2022.\n\n• ^ \"Robots turn racist and sexist with flawed AI, study finds\". ScienceDaily. 21 June 2022.\n\n• ^ Sample (2017).\n\n• ^ \"Black Box AI\". 16 June 2023. Archived from the original on 15 June 2024. Retrieved 5 October 2024.\n\n• ^ Christian (2020), p. 110.\n\n• ^ Christian (2020), pp. 88-91.\n\n• ^ Christian (2020, p. 83); Russell & Norvig (2021, p. 997)\n\n• ^ Christian (2020), p. 91.\n\n• ^ Christian (2020), p. 83.\n\n• ^ Verma (2021).\n\n• ^ Rothman (2020).\n\n• ^ Christian (2020), pp. 105-108.\n\n• ^ Christian (2020), pp. 108-112.\n\n• ^ Ropek, Lucas (21 May 2024). \"New Anthropic Research Sheds Light on AI's 'Black Box'\". Gizmodo. Archived from the original on 5 October 2024. Retrieved 23 May 2024.\n\n• ^ Russell & Norvig (2021), p. 989.\n\n• ^ Jump up to: a b Russell & Norvig (2021), pp. 987-990.\n\n• ^ Russell & Norvig (2021), p. 988.\n\n• ^ Robitzski (2018); Sainato (2015)\n\n• ^ Harari (2018).\n\n• ^ Buckley, Chris; Mozur, Paul (22 May 2019). \"How China Uses High-Tech Surveillance to Subdue Minorities\". The New York Times. Archived from the original on 25 November 2019. Retrieved 2 July 2019.\n\n• ^ Whittaker, Zack (3 May 2019). \"Security lapse exposed a Chinese smart city surveillance system\". TechCrunch. Archived from the original on 7 March 2021. Retrieved 14 September 2020.\n\n• ^ Urbina et al. (2022).\n\n• ^ Jump up to: a b McGaughey (2022).\n\n• ^ Ford & Colvin (2015); McGaughey (2022)\n\n• ^ IGM Chicago (2017).\n\n• ^ Arntz, Gregory & Zierahn (2016), p. 33.\n\n• ^ Lohr (2017); Frey & Osborne (2017); Arntz, Gregory & Zierahn (2016, p. 33)\n\n• ^ Zhou, Viola (11 April 2023). \"AI is already taking video game illustrators' jobs in China\". Rest of World. Archived from the original on 21 February 2024. Retrieved 17 August 2023.\n\n• ^ Carter, Justin (11 April 2023). \"China's game art industry reportedly decimated by growing AI use\". Game Developer. Archived from the original on 17 August 2023. Retrieved 17 August 2023.\n\n• ^ Morgenstern (2015).\n\n• ^ Mahdawi (2017); Thompson (2014)\n\n• ^ Ma, Jason (5 July 2025). \"Ford CEO Jim Farley warns AI will wipe out half of white-collar jobs, but the 'essential economy' has a huge shortage of workers\". Fortune. Retrieved 21 October 2025.\n\n• ^ Tarnoff, Ben (4 August 2023). \"Lessons from Eliza\". The Guardian Weekly. pp. 34-39.\n\n• ^ Cellan-Jones (2014).\n\n• ^ Russell & Norvig 2021, p. 1001.\n\n• ^ Bostrom (2014).\n\n• ^ Russell (2019).\n\n• ^ Bostrom (2014); Müller & Bostrom (2014); Bostrom (2015).\n\n• ^ Harari (2023).\n\n• ^ Stewart (2025).\n\n• ^ Müller & Bostrom (2014).\n\n• ^ Leaders' concerns about the existential risks of AI around 2015: Rawlinson (2015), Holley (2015), Gibbs (2014), Sainato (2015)\n\n• ^ \"\"Godfather of artificial intelligence\" talks impact and potential of new AI\". CBS News. 25 March 2023. Archived from the original on 28 March 2023. Retrieved 28 March 2023.\n\n• ^ Pittis, Don (4 May 2023). \"Canadian artificial intelligence leader Geoffrey Hinton piles on fears of computer takeover\". CBC. Archived from the original on 7 July 2024. Retrieved 5 October 2024.\n\n• ^ \"'50-50 chance' that AI outsmarts humanity, Geoffrey Hinton says\". Bloomberg BNN. 14 June 2024. Archived from the original on 14 June 2024. Retrieved 6 July 2024.\n\n• ^ Valance (2023).\n\n• ^ Taylor, Josh (7 May 2023). \"Rise of artificial intelligence is inevitable but should not be feared, 'father of AI' says\". The Guardian. Archived from the original on 23 October 2023. Retrieved 26 May 2023.\n\n• ^ Colton, Emma (7 May 2023). \"'Father of AI' says tech fears misplaced: 'You cannot stop it'\". Fox News. Archived from the original on 26 May 2023. Retrieved 26 May 2023.\n\n• ^ Jones, Hessie (23 May 2023). \"Juergen Schmidhuber, Renowned 'Father Of Modern AI,' Says His Life's Work Won't Lead To Dystopia\". Forbes. Archived from the original on 26 May 2023. Retrieved 26 May 2023.\n\n• ^ McMorrow, Ryan (19 December 2023). \"Andrew Ng: 'Do we think the world is better off with more or less intelligence?'\". Financial Times. Archived from the original on 25 January 2024. Retrieved 30 December 2023.\n\n• ^ Will Douglas Heaven (2 May 2023). \"Geoffrey Hinton tells us why he's now scared of the tech he helped build\". MIT Technology Review. Ideas AI. Retrieved 4 January 2026.\n\n• ^ Levy, Steven (22 December 2023). \"How Not to Be Stupid About AI, With Yann LeCun\". Wired. Archived from the original on 28 December 2023. Retrieved 30 December 2023.\n\n• ^ Arguments that AI is not an imminent risk: Brooks (2014), Geist (2015), Madrigal (2015), Lee (2014)\n\n• ^ Jump up to: a b Christian (2020), pp. 67, 73.\n\n• ^ Yudkowsky (2008).\n\n• ^ Jump up to: a b Anderson & Anderson (2011).\n\n• ^ AAAI (2014).\n\n• ^ Wallach (2010).\n\n• ^ Russell (2019), p. 173.\n\n• ^ Stewart, Ashley; Melton, Monica. \"Hugging Face CEO says he's focused on building a 'sustainable model' for the $4.5 billion open-source-AI startup\". Business Insider. Archived from the original on 25 September 2024. Retrieved 14 April 2024.\n\n• ^ Wiggers, Kyle (9 April 2024). \"Google open sources tools to support AI model development\". TechCrunch. Archived from the original on 10 September 2024. Retrieved 14 April 2024.\n\n• ^ Heaven, Will Douglas (12 May 2023). \"The open-source AI boom is built on Big Tech's handouts. How long will it last?\". MIT Technology Review. Retrieved 14 April 2024.\n\n• ^ Brodsky, Sascha (19 December 2023). \"Mistral AI's New Language Model Aims for Open Source Supremacy\". AI Business. Archived from the original on 5 September 2024. Retrieved 5 October 2024.\n\n• ^ Edwards, Benj (22 February 2024). \"Stability announces Stable Diffusion 3, a next-gen AI image generator\". Ars Technica. Archived from the original on 5 October 2024. Retrieved 14 April 2024.\n\n• ^ Marshall, Matt (29 January 2024). \"How enterprises are using open source LLMs: 16 examples\". VentureBeat. Archived from the original on 26 September 2024. Retrieved 5 October 2024.\n\n• ^ Piper, Kelsey (2 February 2024). \"Should we make our most powerful AI models open source to all?\". Vox. Archived from the original on 5 October 2024. Retrieved 14 April 2024.\n\n• ^ Alan Turing Institute (2019). \"Understanding artificial intelligence ethics and safety\" (PDF). Archived (PDF) from the original on 11 September 2024. Retrieved 5 October 2024.\n\n• ^ Alan Turing Institute (2023). \"AI Ethics and Governance in Practice\" (PDF). Archived (PDF) from the original on 11 September 2024. Retrieved 5 October 2024.\n\n• ^ Floridi, Luciano; Cowls, Josh (23 June 2019). \"A Unified Framework of Five Principles for AI in Society\". Harvard Data Science Review. 1 (1). doi:10.1162/99608f92.8cd550d1.\n\n• ^ Buruk, Banu; Ekmekci, Perihan Elif; Arda, Berna (1 September 2020). \"A critical perspective on guidelines for responsible and trustworthy artificial intelligence\". Medicine, Health Care and Philosophy. 23 (3): 387-399. doi:10.1007/s11019-020-09948-1. PMID 32236794.\n\n• ^ Kamila, Manoj Kumar; Jasrotia, Sahil Singh (1 January 2023). \"Ethical issues in the development of artificial intelligence: recognizing the risks\". International Journal of Ethics and Systems. 41 (ahead-of-print): 45-63. doi:10.1108/IJOES-05-2023-0107.\n\n• ^ \"AI Safety Institute releases new AI safety evaluations platform\". UK Government. 10 May 2024. Archived from the original on 5 October 2024. Retrieved 14 May 2024.\n\n• ^ Regulation of AI to mitigate risks: Berryhill et al. (2019), Barfield & Pagallo (2018), Iphofen & Kritikos (2019), Wirtz, Weyerer & Geyer (2018), Buiten (2019)\n\n• ^ Law Library of Congress (U. S.). Global Legal Research Directorate (2019).\n\n• ^ Jump up to: a b Vincent (2023).\n\n• ^ Stanford University (2023).\n\n• ^ Jump up to: a b c d UNESCO (2021).\n\n• ^ Kissinger (2021).\n\n• ^ Altman, Brockman & Sutskever (2023).\n\n• ^ VOA News (25 October 2023). \"UN Announces Advisory Body on Artificial Intelligence\". Voice of America. Archived from the original on 18 September 2024. Retrieved 5 October 2024.\n\n• ^ \"AI Act enters into force - European Commission\". commission. europa. eu. Retrieved 11 August 2025.\n\n• ^ \"Council of Europe opens first ever global treaty on AI for signature\". Council of Europe. 5 September 2024. Archived from the original on 17 September 2024. Retrieved 17 September 2024.\n\n• ^ Edwards (2023).\n\n• ^ Kasperowicz (2023).\n\n• ^ Fox News (2023).\n\n• ^ Milmo, Dan (3 November 2023). \"Hope or Horror? The great AI debate dividing its pioneers\". The Guardian Weekly. pp. 10-12.\n\n• ^ \"The Bletchley Declaration by Countries Attending the AI Safety Summit, 1-2 November 2023\". GOV. UK. 1 November 2023. Archived from the original on 1 November 2023. Retrieved 2 November 2023.\n\n• ^ \"Countries agree to safe and responsible development of frontier AI in landmark Bletchley Declaration\". GOV. UK (Press release). Archived from the original on 1 November 2023. Retrieved 1 November 2023.\n\n• ^ \"Second global AI summit secures safety commitments from companies\". Reuters. 21 May 2024. Retrieved 23 May 2024.\n\n• ^ \"Frontier AI Safety Commitments, AI Seoul Summit 2024\". gov. uk. 21 May 2024. Archived from the original on 23 May 2024. Retrieved 23 May 2024.\n\n• ^ Jump up to: a b Buntz, Brian (3 November 2024). \"Quality vs. quantity: US and China chart different paths in global AI patent race in 2024 / Geographical breakdown of AI patents in 2024\". Research & Development World. R&D World. Archived from the original on 9 December 2024.\n\n• ^ Jump up to: a b Russell & Norvig 2021, p. 9.\n\n• ^ Jump up to: a b c Copeland, J., ed. (2004). The Essential Turing: the ideas that gave birth to the computer age. Oxford, England: Clarendon Press. ISBN 0-1982-5079-7.\n\n• ^ \"Google books ngram\". Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• ^ AI's immediate precursors: McCorduck (2004, pp. 51-107), Crevier (1993, pp. 27-32), Russell & Norvig (2021, pp. 8-17), Moravec (1988, p. 3)\n\n• ^ Jump up to: a b Turing's original publication of the Turing test in \"Computing machinery and intelligence\": Turing (1950)\nHistorical influence and philosophical implications: Haugeland (1985, pp. 6-9), Crevier (1993, p. 24), McCorduck (2004, pp. 70-71), Russell & Norvig (2021, pp. 2, 984)\n\n• ^ Crevier (1993), pp. 47-49.\n\n• ^ Russell & Norvig (2003), p. 17.\n\n• ^ Russell & Norvig (2003), p. 18.\n\n• ^ Newquist (1994), pp. 86-86.\n\n• ^ Simon (1965, p. 96) quoted in Crevier (1993, p. 109)\n\n• ^ Minsky (1967, p. 2) quoted in Crevier (1993, p. 109)\n\n• ^ Russell & Norvig (2021), p. 21.\n\n• ^ Lighthill (1973).\n\n• ^ NRC 1999, pp. 212-213.\n\n• ^ Russell & Norvig (2021), p. 22.\n\n• ^ Expert systems: Russell & Norvig (2021, pp. 23, 292), Luger & Stubblefield (2004, pp. 227-331), Nilsson (1998, chpt. 17.4), McCorduck (2004, pp. 327-335, 434-435), Crevier (1993, pp. 145-162, 197-203), Newquist (1994, pp. 155-183)\n\n• ^ Russell & Norvig (2021), p. 24.\n\n• ^ Nilsson (1998), p. 7.\n\n• ^ McCorduck (2004), pp. 454-462.\n\n• ^ Moravec (1988).\n\n• ^ Jump up to: a b Brooks (1990).\n\n• ^ Developmental robotics: Weng et al. (2001), Lungarella et al. (2003), Asada et al. (2009), Oudeyer (2010)\n\n• ^ Russell & Norvig (2021), p. 25.\n\n• ^ Crevier (1993, pp. 214-215), Russell & Norvig (2021, pp. 24, 26)\n\n• ^ Russell & Norvig (2021), p. 26.\n\n• ^ Formal and narrow methods adopted in the 1990s: Russell & Norvig (2021, pp. 24-26), McCorduck (2004, pp. 486-487)\n\n• ^ AI widely used in the late 1990s: Kurzweil (2005, p. 265), NRC (1999, pp. 216-222), Newquist (1994, pp. 189-201)\n\n• ^ Wong (2023).\n\n• ^ Moore's Law and AI: Russell & Norvig (2021, pp. 14, 27)\n\n• ^ Jump up to: a b c Clark (2015b).\n\n• ^ Big data: Russell & Norvig (2021, p. 26)\n\n• ^ Sagar, Ram (3 June 2020). \"OpenAI Releases GPT-3, The Largest Model So Far\". Analytics India Magazine. Archived from the original on 4 August 2020. Retrieved 15 March 2023.\n\n• ^ Milmo, Dan (2 February 2023). \"ChatGPT reaches 100 million users two months after launch\". The Guardian. ISSN 0261-3077. Archived from the original on 3 February 2023. Retrieved 31 December 2024.\n\n• ^ Gorichanaz, Tim (29 November 2023). \"ChatGPT turns 1: AI chatbot's success says as much about humans as technology\". The Conversation. Archived from the original on 31 December 2024. Retrieved 31 December 2024.\n\n• ^ DiFeliciantonio (2023).\n\n• ^ Goswami (2023).\n\n• ^ \"Nearly 1 in 4 new startups is an AI company\". PitchBook. 24 December 2024. Retrieved 3 January 2025.\n\n• ^ Grayling, Anthony; Ball, Brian (1 August 2024). \"Philosophy is crucial in the age of AI\". The Conversation. Archived from the original on 5 October 2024. Retrieved 4 October 2024.\n\n• ^ Jump up to: a b Jarow, Oshan (15 June 2024). \"Will AI ever become conscious? It depends on how you think about biology\". Vox. Archived from the original on 21 September 2024. Retrieved 4 October 2024.\n\n• ^ McCarthy, John. \"The Philosophy of AI and the AI of Philosophy\". jmc. stanford. edu. Archived from the original on 23 October 2018. Retrieved 3 October 2024.\n\n• ^ Jump up to: a b Turing (1950), p. 1.\n\n• ^ Turing (1950), Under \"The Argument from Consciousness\".\n\n• ^ Kirk-Giannini, Cameron Domenico; Goldstein, Simon (16 October 2023). \"AI is closer than ever to passing the Turing test for 'intelligence'. What happens when it does?\". The Conversation. Archived from the original on 25 September 2024. Retrieved 17 August 2024.\n\n• ^ Russell & Norvig (2021), p. 3.\n\n• ^ Maker (2006).\n\n• ^ McCarthy (1999).\n\n• ^ Minsky (1986).\n\n• ^ Suchman, Lucy (2023). \"The uncontroversial 'thingness' of AI\". Big Data & Society. 10 (2) 20539517231206794. doi:10.1177/20539517231206794.\n\n• ^ Rehak, Rainer (2025). \"AI Narrative Breakdown. A Critical Assessment of Power and Promise\". Proceedings of the 2025 ACM Conference on Fairness, Accountability, and Transparency. pp. 1250-1260. doi:10.1145/3715275.3732083. ISBN 979-8-4007-1482-5.\n\n• ^ Musser, George (1 September 2023). \"How AI Knows Things No One Told It\". Scientific American. Retrieved 17 July 2025.\n\n• ^ \"AI or BS? How to tell if a marketing tool really uses artificial intelligence\". The Drum. Retrieved 31 July 2024.\n\n• ^ Information technology - Artificial intelligence - Artificial intelligence concepts and terminology, BSI British Standards, doi:10.3403/30467396\n\n• ^ \"Regulation - EU - 2024/1689 - EN - EUR-Lex\". eur-lex. europa. eu. Retrieved 30 January 2026.\n\n• ^ Tabassi, Elham (26 January 2023). Artificial Intelligence Risk Management Framework (AI RMF 1.0) (Report). Gaithersburg, MD: National Institute of Standards and Technology (U. S.). doi:10.6028/nist. ai.100-1.\n\n• ^ Nilsson (1983), p. 10.\n\n• ^ Haugeland (1985), pp. 112-117.\n\n• ^ Physical symbol system hypothesis: Newell & Simon (1976, p. 116)\nHistorical significance: McCorduck (2004, p. 153), Russell & Norvig (2021, p. 19)\n\n• ^ Moravec's paradox: Moravec (1988, pp. 15-16), Minsky (1986, p. 29), Pinker (2007, pp. 190-191)\n\n• ^ Dreyfus' critique of AI: Dreyfus (1972), Dreyfus & Dreyfus (1986)\nHistorical significance and philosophical implications: Crevier (1993, pp. 120-132), McCorduck (2004, pp. 211-239), Russell & Norvig (2021, pp. 981-982), Fearn (2007, chpt. 3)\n\n• ^ Crevier (1993), p. 125.\n\n• ^ Langley (2011).\n\n• ^ Katz (2012).\n\n• ^ Neats vs. scruffies, the historic debate: McCorduck (2004, pp. 421-424, 486-489), Crevier (1993, p. 168), Nilsson (1983, pp. 10-11), Russell & Norvig (2021, p. 24)\nA classic example of the \"scruffy\" approach to intelligence: Minsky (1986)\nA modern example of neat AI and its aspirations in the 21st century: Domingos (2015)\n\n• ^ Pennachin & Goertzel (2007).\n\n• ^ Jump up to: a b Roberts (2016).\n\n• ^ Russell & Norvig (2021), p. 986.\n\n• ^ Chalmers (1995).\n\n• ^ Dennett (1991).\n\n• ^ Horst (2005).\n\n• ^ Searle (1999).\n\n• ^ Searle (1980), p. 1.\n\n• ^ Russell & Norvig (2021), p. 9817.\n\n• ^ Searle's Chinese room argument: Searle (1980). Searle's original presentation of the thought experiment., Searle (1999).\nDiscussion: Russell & Norvig (2021, pp. 985), McCorduck (2004, pp. 443-445), Crevier (1993, pp. 269-271)\n\n• ^ Leith, Sam (7 July 2022). \"Nick Bostrom: How can we be certain a machine isn't conscious?\". The Spectator. Archived from the original on 26 September 2024. Retrieved 23 February 2024.\n\n• ^ Jump up to: a b c Thomson, Jonny (31 October 2022). \"Why don't robots have rights?\". Big Think. Archived from the original on 13 September 2024. Retrieved 23 February 2024.\n\n• ^ Jump up to: a b Kateman, Brian (24 July 2023). \"AI Should Be Terrified of Humans\". Time. Archived from the original on 25 September 2024. Retrieved 23 February 2024.\n\n• ^ Wong, Jeff (10 July 2023). \"What leaders need to know about robot rights\". Fast Company.\n\n• ^ Hern, Alex (12 January 2017). \"Give robots 'personhood' status, EU committee argues\". The Guardian. ISSN 0261-3077. Archived from the original on 5 October 2024. Retrieved 23 February 2024.\n\n• ^ Dovey, Dana (14 April 2018). \"Experts Don't Think Robots Should Have Rights\". Newsweek. Archived from the original on 5 October 2024. Retrieved 23 February 2024.\n\n• ^ Cuddy, Alice (13 April 2018). \"Robot rights violate human rights, experts warn EU\". euronews. Archived from the original on 19 September 2024. Retrieved 23 February 2024.\n\n• ^ The Intelligence explosion and technological singularity: Russell & Norvig (2021, pp. 1004-1005), Omohundro (2008), Kurzweil (2005)\n\nI. J. Good's \"intelligence explosion\": Good (1965)\n\nVernor Vinge's \"singularity\": Vinge (1993)\n\n• ^ Russell & Norvig (2021), p. 1005.\n\n• ^ Transhumanism: Moravec (1988), Kurzweil (2005), Russell & Norvig (2021, p. 1005)\n\n• ^ AI as evolution: Edward Fredkin is quoted in McCorduck (2004, p. 401), Butler (1863), Dyson (1998)\n\n• ^ AI in myth: McCorduck (2004, pp. 4-5)\n\n• ^ McCorduck (2004), pp. 340-400.\n\n• ^ Buttazzo (2001).\n\n• ^ Anderson (2008).\n\n• ^ McCauley (2007).\n\n• ^ Galvan (1997).\n\n### Textbooks\n\n• Luger, George; Stubblefield, William (2004). Artificial Intelligence: Structures and Strategies for Complex Problem Solving (5th ed.). Benjamin/Cummings. ISBN 978-0-8053-4780-7. Archived from the original on 26 July 2020. Retrieved 17 December 2019.\n\n• Nilsson, Nils (1998). Artificial Intelligence: A New Synthesis. Morgan Kaufmann. ISBN 978-1-5586-0467-4. Archived from the original on 26 July 2020. Retrieved 18 November 2019.\n\n• Poole, David; Mackworth, Alan; Goebel, Randy (1998). Computational Intelligence: A Logical Approach. New York: Oxford University Press. ISBN 978-0-1951-0270-3. Archived from the original on 26 July 2020. Retrieved 22 August 2020. Later edition: Poole, David; Mackworth, Alan (2017). Artificial Intelligence: Foundations of Computational Agents (2nd ed.). Cambridge University Press. ISBN 978-1-1071-9539-4. Archived from the original on 7 December 2017. Retrieved 6 December 2017.\n\n• Rich, Elaine; Knight, Kevin; Nair, Shivashankar (2010). Artificial Intelligence (3rd ed.). New Delhi: Tata McGraw Hill India. ISBN 978-0-0700-8770-5.\n\n• Russell, Stuart J.; Norvig, Peter (2021). Artificial Intelligence: A Modern Approach (4th ed.). Hoboken: Pearson. ISBN 978-0-1346-1099-3. LCCN 20190474.\n\n• Russell, Stuart J.; Norvig, Peter (2003), Artificial Intelligence: A Modern Approach (2nd ed.), Upper Saddle River, New Jersey: Prentice Hall, ISBN 0-13-790395-2.\n\n### History of AI\n\n• Crevier, Daniel (1993). AI: The Tumultuous Search for Artificial Intelligence. New York, NY: BasicBooks. ISBN 0-465-02997-3.\n\n• McCorduck, Pamela (2004), Machines Who Think (2nd ed.), Natick, Massachusetts: A. K. Peters, ISBN 1-5688-1205-1\n\n• Newquist, H. P. (1994). The Brain Makers: Genius, Ego, And Greed In The Quest For Machines That Think. New York: Macmillan/SAMS. ISBN 978-0-6723-0412-5.\n\n### Other sources\n\n• AI & ML in Fusion\n\n• AI & ML in Fusion, video lecture Archived 2 July 2023 at the Wayback Machine\n\n• Alter, Alexandra; Harris, Elizabeth A. (20 September 2023), \"Franzen, Grisham and Other Prominent Authors Sue OpenAI\", The New York Times, archived from the original on 14 September 2024, retrieved 5 October 2024\n\n• Altman, Sam; Brockman, Greg; Sutskever, Ilya (22 May 2023). \"Governance of Superintelligence\". openai. com. Archived from the original on 27 May 2023. Retrieved 27 May 2023.\n\n• Anderson, Susan Leigh (2008). \"Asimov's 'three laws of robotics' and machine metaethics\". AI & Society. 22 (4): 477-493. doi:10.1007/s00146-007-0094-5.\n\n• Anderson, Michael; Anderson, Susan Leigh (2011). Machine Ethics. Cambridge University Press.\n\n• Arntz, Melanie; Gregory, Terry; Zierahn, Ulrich (2016), \"The risk of automation for jobs in OECD countries: A comparative analysis\", OECD Social, Employment, and Migration Working Papers 189\n\n• Asada, M.; Hosoda, K.; Kuniyoshi, Y.; Ishiguro, H.; Inui, T.; Yoshikawa, Y.; Ogino, M.; Yoshida, C. (2009). \"Cognitive developmental robotics: a survey\". IEEE Transactions on Autonomous Mental Development. 1 (1): 12-34. Bibcode:2009ITAMD...1...12A. doi:10.1109/tamd.2009.2021702.\n\n• \"Ask the AI experts: What's driving today's progress in AI?\". McKinsey & Company. Archived from the original on 13 April 2018. Retrieved 13 April 2018.\n\n• Barfield, Woodrow; Pagallo, Ugo (2018). Research handbook on the law of artificial intelligence. Cheltenham, UK: Edward Elgar Publishing. ISBN 978-1-7864-3904-8. OCLC 1039480085.\n\n• Beal, J.; Winston, Patrick (2009), \"The New Frontier of Human-Level Artificial Intelligence\", IEEE Intelligent Systems, 24 (4): 21-24, Bibcode:2009IISys..24d..21B, doi:10.1109/MIS.2009.75, hdl:1721.1/52357\n\n• Berdahl, Carl Thomas; Baker, Lawrence; Mann, Sean; Osoba, Osonde; Girosi, Federico (7 February 2023). \"Strategies to Improve the Impact of Artificial Intelligence on Health Equity: Scoping Review\". JMIR AI. 2 e42936. doi:10.2196/42936. PMC 11041459. PMID 38875587.\n\n• Berryhill, Jamie; Heang, Kévin Kok; Clogher, Rob; McBride, Keegan (2019). Hello, World: Artificial Intelligence and its Use in the Public Sector (PDF). Paris: OECD Observatory of Public Sector Innovation. Archived (PDF) from the original on 20 December 2019. Retrieved 9 August 2020.\n\n• Bertini, Marco; Del Bimbo, Alberto; Torniai, Carlo (2006). \"Automatic annotation and semantic retrieval of video sequences using multimedia ontologies\". Proceedings of the 14th ACM international conference on Multimedia. pp. 679-682. doi:10.1145/1180639.1180782. ISBN 1-59593-447-2.\n\n• Bostrom, Nick (2014). Superintelligence: Paths, Dangers, Strategies. Oxford University Press.\n\n• Bostrom, Nick (2015). \"What happens when our computers get smarter than we are?\". TED (conference). Archived from the original on 25 July 2020. Retrieved 30 January 2020.\n\n• Brooks, Rodney (10 November 2014). \"artificial intelligence is a tool, not a threat\". Rethink Robotics. Archived from the original on 12 November 2014.\n\n• Brooks, Rodney A. (1990). \"Elephants don't play chess\". Robotics and Autonomous Systems. 6 (1-2): 3-15. doi:10.1016/S0921-8890(05)80025-9.\n\n• Buiten, Miriam C (2019). \"Towards Intelligent Regulation of Artificial Intelligence\". European Journal of Risk Regulation. 10 (1): 41-59. doi:10.1017/err.2019.8. ISSN 1867-299X.\n\n• Bushwick, Sophie (16 March 2023), \"What the New GPT-4 AI Can Do\", Scientific American, archived from the original on 22 August 2023, retrieved 5 October 2024\n\n• Butler, Samuel (13 June 1863). \"Darwin among the Machines\". Letters to the Editor. The Press. Christchurch, New Zealand. Archived from the original on 19 September 2008. Retrieved 16 October 2014 - via Victoria University of Wellington.\n\n• Buttazzo, G. (July 2001). \"Artificial consciousness: Utopia or real possibility?\". Computer. 34 (7): 24-30. Bibcode:2001Compr..34g..24B. doi:10.1109/2.933500.\n\n• Cambria, Erik; White, Bebo (May 2014). \"Jumping NLP Curves: A Review of Natural Language Processing Research [Review Article]\". IEEE Computational Intelligence Magazine. 9 (2): 48-57. doi:10.1109/MCI.2014.2307227.\n\n• Cellan-Jones, Rory (2 December 2014). \"Stephen Hawking warns artificial intelligence could end mankind\". BBC News. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Chalmers, David (1995). \"Facing up to the problem of consciousness\". Journal of Consciousness Studies. 2 (3): 200-219.\n\n• Challa, Subhash; Moreland, Mark R.; Mušicki, Darko; Evans, Robin J. (2011). Fundamentals of Object Tracking. Cambridge University Press. doi:10.1017/CBO9780511975837. ISBN 978-0-5218-7628-5.\n\n• Christian, Brian (2020). The Alignment Problem: Machine learning and human values. W. W. Norton & Company. ISBN 978-0-3938-6833-3. OCLC 1233266753.\n\n• Ciresan, D.; Meier, U.; Schmidhuber, J. (2012). \"Multi-column deep neural networks for image classification\". 2012 IEEE Conference on Computer Vision and Pattern Recognition. pp. 3642-3649. arXiv:1202.2745. doi:10.1109/cvpr.2012.6248110. ISBN 978-1-4673-1228-8.\n\n• Clark, Jack (2015b). \"Why 2015 Was a Breakthrough Year in Artificial Intelligence\". Bloomberg. com. Archived from the original on 23 November 2016. Retrieved 23 November 2016.\n\n• CNA (12 January 2019). \"Commentary: Bad news. Artificial intelligence is biased\". CNA. Archived from the original on 12 January 2019. Retrieved 19 June 2020.\n\n• Cybenko, G. (1988). Continuous valued neural networks with two hidden layers are sufficient (Report). Department of Computer Science, Tufts University.\n\n• Deng, L.; Yu, D. (2014). \"Deep Learning: Methods and Applications\" (PDF). Foundations and Trends in Signal Processing. 7 (3-4): 197-387. doi:10.1561/2000000039. Archived (PDF) from the original on 14 March 2016. Retrieved 18 October 2014.\n\n• Dennett, Daniel (1991). Consciousness Explained. The Penguin Press. ISBN 978-0-7139-9037-9.\n\n• DiFeliciantonio, Chase (3 April 2023). \"AI has already changed the world. This report shows how\". San Francisco Chronicle. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Dickson, Ben (2 May 2022). \"Machine learning: What is the transformer architecture?\". TechTalks. Archived from the original on 22 November 2023. Retrieved 22 November 2023.\n\n• Domingos, Pedro (2015). The Master Algorithm: How the Quest for the Ultimate Learning Machine Will Remake Our World. Basic Books. ISBN 978-0-4650-6570-7.\n\n• Dreyfus, Hubert (1972). What Computers Can't Do. New York: MIT Press. ISBN 978-0-0601-1082-6.\n\n• Dreyfus, Hubert; Dreyfus, Stuart (1986). Mind over Machine: The Power of Human Intuition and Expertise in the Era of the Computer. Oxford: Blackwell. ISBN 978-0-0290-8060-3. Archived from the original on 26 July 2020. Retrieved 22 August 2020.\n\n• Dyson, George (1998). Darwin among the Machines. Allan Lane Science. ISBN 978-0-7382-0030-9. Archived from the original on 26 July 2020. Retrieved 22 August 2020.\n\n• Edelson, Edward (1991). The Nervous System. New York: Chelsea House. ISBN 978-0-7910-0464-7. Archived from the original on 26 July 2020. Retrieved 18 November 2019.\n\n• Edwards, Benj (17 May 2023). \"Poll: AI poses risk to humanity, according to majority of Americans\". Ars Technica. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Fearn, Nicholas (2007). The Latest Answers to the Oldest Questions: A Philosophical Adventure with the World's Greatest Thinkers. New York: Grove Press. ISBN 978-0-8021-1839-4.\n\n• Ford, Martin; Colvin, Geoff (6 September 2015). \"Will robots create more jobs than they destroy?\". The Guardian. Archived from the original on 16 June 2018. Retrieved 13 January 2018.\n\n• Fox News (2023). \"Fox News Poll\" (PDF). Fox News. Archived (PDF) from the original on 12 May 2023. Retrieved 19 June 2023.\n\n• Frey, Carl Benedikt; Osborne, Michael A (2017). \"The future of employment: How susceptible are jobs to computerisation?\". Technological Forecasting and Social Change. 114: 254-280. doi:10.1016/j. techfore.2016.08.019.\n\n• \"From not working to neural networking\". The Economist. 2016. Archived from the original on 31 December 2016. Retrieved 26 April 2018.\n\n• Galvan, Jill (1 January 1997). \"Entering the Posthuman Collective in Philip K. Dick's \"Do Androids Dream of Electric Sheep?\"\". Science Fiction Studies. 24 (3): 413-429. doi:10.1525/sfs.24.3.0413. JSTOR 4240644.\n\n• Geist, Edward Moore (9 August 2015). \"Is artificial intelligence really an existential threat to humanity?\". Bulletin of the Atomic Scientists. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Gibbs, Samuel (27 October 2014). \"Elon Musk: artificial intelligence is our biggest existential threat\". The Guardian. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Goffrey, Andrew (2008). \"Algorithm\". In Fuller, Matthew (ed.). Software studies: a lexicon. Cambridge, Mass.: MIT Press. pp. 15-20. ISBN 978-1-4356-4787-9.\n\n• Goldman, Sharon (14 September 2022). \"10 years later, deep learning 'revolution' rages on, say AI pioneers Hinton, LeCun and Li\". VentureBeat. Archived from the original on 5 October 2024. Retrieved 8 December 2023.\n\n• Good, I. J. (1965), Speculations Concerning the First Ultraintelligent Machine, archived from the original on 10 July 2023, retrieved 5 October 2024\n\n• Goodfellow, Ian; Bengio, Yoshua; Courville, Aaron (2016), Deep Learning, MIT Press., archived from the original on 16 April 2016, retrieved 12 November 2017\n\n• Goodman, Bryce; Flaxman, Seth (2017). \"EU regulations on algorithmic decision-making and a 'right to explanation'\". AI Magazine. 38 (3): 50. arXiv:1606.08813. doi:10.1609/aimag. v38i3.2741.\n\n• Government Accountability Office (13 September 2022). Consumer Data: Increasing Use Poses Risks to Privacy. gao. gov (Report). Archived from the original on 13 September 2024. Retrieved 5 October 2024.\n\n• Grant, Nico; Hill, Kashmir (22 May 2023). \"Google's Photo App Still Can't Find Gorillas. And Neither Can Apple's\". The New York Times. Archived from the original on 14 September 2024. Retrieved 5 October 2024.\n\n• Goswami, Rohan (5 April 2023). \"Here's where the A. I. jobs are\". CNBC. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Harari, Yuval Noah (October 2018). \"Why Technology Favors Tyranny\". The Atlantic. Archived from the original on 25 September 2021. Retrieved 23 September 2021.\n\n• Harari, Yuval Noah (2023). \"AI and the future of humanity\". YouTube. Archived from the original on 30 September 2024. Retrieved 5 October 2024.\n\n• Haugeland, John (1985). Artificial Intelligence: The Very Idea. Cambridge, Mass.: MIT Press. ISBN 978-0-2620-8153-5.\n\n• Hinton, G.; Deng, L.; Yu, D.; Dahl, G.; Mohamed, A.; Jaitly, N.; Senior, A.; Vanhoucke, V.; Nguyen, P.; Sainath, T.; Kingsbury, B. (2012). \"Deep Neural Networks for Acoustic Modeling in Speech Recognition - The shared views of four research groups\". IEEE Signal Processing Magazine. 29 (6): 82-97. Bibcode:2012ISPM...29...82H. doi:10.1109/msp.2012.2205597.\n\n• Holley, Peter (28 January 2015). \"Bill Gates on dangers of artificial intelligence: 'I don't understand why some people are not concerned'\". The Washington Post. ISSN 0190-8286. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Hornik, Kurt; Stinchcombe, Maxwell; White, Halbert (1989). Multilayer Feedforward Networks are Universal Approximators (PDF). Neural Networks. Vol. 2. Pergamon Press. pp. 359-366. Archived (PDF) from the original on 21 April 2023. Retrieved 5 October 2024.\n\n• Horst, Steven (2005). \"The Computational Theory of Mind\". The Stanford Encyclopedia of Philosophy. Archived from the original on 6 March 2016. Retrieved 7 March 2016.\n\n• Howe, J. (November 1994). \"Artificial Intelligence at Edinburgh University: a Perspective\". Archived from the original on 15 May 2007. Retrieved 30 August 2007.\n\n• IGM Chicago (30 June 2017). \"Robots and Artificial Intelligence\". igmchicago. org. Archived from the original on 1 May 2019. Retrieved 3 July 2019.\n\n• Iphofen, Ron; Kritikos, Mihalis (3 January 2019). \"Regulating artificial intelligence and robotics: ethics by design in a digital society\". Contemporary Social Science. 16 (2): 170-184. doi:10.1080/21582041.2018.1563803. ISSN 2158-2041.\n\n• Jordan, M. I.; Mitchell, T. M. (16 July 2015). \"Machine learning: Trends, perspectives, and prospects\". Science. 349 (6245): 255-260. Bibcode:2015Sci...349..255J. doi:10.1126/science. aaa8415. PMID 26185243.\n\n• Kahneman, Daniel; Slovic, Paul; Tversky, Amos (1982). Judgment Under Uncertainty: Heuristics and Biases. Cambridge University Press.\n\n• Kahneman, Daniel (2011). Thinking, Fast and Slow. Macmillan. ISBN 978-1-4299-6935-2. Archived from the original on 15 March 2023. Retrieved 8 April 2012.\n\n• Kasperowicz, Peter (1 May 2023). \"Regulate AI? GOP much more skeptical than Dems that government can do it right: poll\". Fox News. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Katz, Yarden (1 November 2012). \"Noam Chomsky on Where Artificial Intelligence Went Wrong\". The Atlantic. Archived from the original on 28 February 2019. Retrieved 26 October 2014.\n\n• \"Kismet\". MIT Artificial Intelligence Laboratory, Humanoid Robotics Group. Archived from the original on 17 October 2014. Retrieved 25 October 2014.\n\n• Kissinger, Henry (1 November 2021). \"The Challenge of Being Human in the Age of AI\". The Wall Street Journal. Archived from the original on 4 November 2021. Retrieved 4 November 2021.\n\n• Kobielus, James (27 November 2019). \"GPUs Continue to Dominate the AI Accelerator Market for Now\". InformationWeek. Archived from the original on 19 October 2021. Retrieved 11 June 2020.\n\n• Kuperman, G. J.; Reichley, R. M.; Bailey, T. C. (1 July 2006). \"Using Commercial Knowledge Bases for Clinical Decision Support: Opportunities, Hurdles, and Recommendations\". Journal of the American Medical Informatics Association. 13 (4): 369-371. doi:10.1197/jamia. M2055. PMC 1513681. PMID 16622160.\n\n• Kurzweil, Ray (2005). The Singularity is Near. Penguin Books. ISBN 978-0-6700-3384-3.\n\n• Langley, Pat (2011). \"The changing science of machine learning\". Machine Learning. 82 (3): 275-279. doi:10.1007/s10994-011-5242-y.\n\n• Larson, Jeff; Angwin, Julia (23 May 2016). \"How We Analyzed the COMPAS Recidivism Algorithm\". ProPublica. Archived from the original on 29 April 2019. Retrieved 19 June 2020.\n\n• Laskowski, Nicole (November 2023). \"What is Artificial Intelligence and How Does AI Work? TechTarget\". Enterprise AI. Archived from the original on 5 October 2024. Retrieved 30 October 2023.\n\n• Law Library of Congress (U. S.). Global Legal Research Directorate, issuing body. (2019). Regulation of artificial intelligence in selected jurisdictions. LCCN 2019668143. OCLC 1110727808.\n\n• Lee, Timothy B. (22 August 2014). \"Will artificial intelligence destroy humanity? Here are 5 reasons not to worry\". Vox. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Lenat, Douglas; Guha, R. V. (1989). Building Large Knowledge-Based Systems. Addison-Wesley. ISBN 978-0-2015-1752-1.\n\n• Lighthill, James (1973). \"Artificial Intelligence: A General Survey\". Artificial Intelligence: a paper symposium. Science Research Council.\n\n• Lipartito, Kenneth (6 January 2011), The Narrative and the Algorithm: Genres of Credit Reporting from the Nineteenth Century to Today (PDF) (Unpublished manuscript), SSRN 1736283, archived (PDF) from the original on 9 October 2022\n\n• Lohr, Steve (2017). \"Robots Will Take Jobs, but Not as Fast as Some Fear, New Report Says\". The New York Times. Archived from the original on 14 January 2018. Retrieved 13 January 2018.\n\n• Lungarella, M.; Metta, G.; Pfeifer, R.; Sandini, G. (2003). \"Developmental robotics: a survey\". Connection Science. 15 (4): 151-190. Bibcode:2003ConSc..15..151L. doi:10.1080/09540090310001655110.\n\n• \"Machine Ethics\". aaai. org. Archived from the original on 29 November 2014.\n\n• Madrigal, Alexis C. (27 February 2015). \"The case against killer robots, from a guy actually working on artificial intelligence\". Fusion. net. Archived from the original on 4 February 2016. Retrieved 31 January 2016.\n\n• Mahdawi, Arwa (26 June 2017). \"What jobs will still be around in 20 years? Read this to prepare your future\". The Guardian. Archived from the original on 14 January 2018. Retrieved 13 January 2018.\n\n• Maker, Meg Houston (2006), AI@50: AI Past, Present, Future, Dartmouth College, archived from the original on 8 October 2008, retrieved 16 October 2008\n\n• Marmouyet, Françoise (15 December 2023). \"Google's Gemini: is the new AI model really better than ChatGPT?\". The Conversation. Archived from the original on 4 March 2024. Retrieved 25 December 2023.\n\n• Minsky, Marvin (1986), The Society of Mind, Simon and Schuster\n\n• McCarthy, John; Minsky, Marvin; Rochester, Nathan; Shannon, Claude (1955). \"A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence\". stanford. edu. Archived from the original on 26 August 2007. Retrieved 30 August 2007.\n\n• McCarthy, John (2007), \"From Here to Human-Level AI\", Artificial Intelligence, p. 171\n\n• McCarthy, John (1999), What is AI?, archived from the original on 4 December 2022, retrieved 4 December 2022\n\n• McCauley, Lee (2007). \"AI armageddon and the three laws of robotics\". Ethics and Information Technology. 9 (2): 153-164. doi:10.1007/s10676-007-9138-2. ProQuest 222198675.\n\n• McGarry, Ken (1 December 2005). \"A survey of interestingness measures for knowledge discovery\". The Knowledge Engineering Review. 20 (1): 39-61. doi:10.1017/S0269888905000408.\n\n• McGaughey, Ewan (2022). \"Will Robots Automate Your Job Away? Full Employment, Basic Income and Economic Democracy\". Industrial Law Journal. 51 (3): 511-559. doi:10.1093/indlaw/dwab010. SSRN 3044448.\n\n• Merkle, Daniel; Middendorf, Martin (2013). \"Swarm Intelligence\". In Burke, Edmund K.; Kendall, Graham (eds.). Search Methodologies: Introductory Tutorials in Optimization and Decision Support Techniques. Springer Science & Business Media. ISBN 978-1-4614-6940-7.\n\n• Minsky, Marvin (1967), Computation: Finite and Infinite Machines, Englewood Cliffs, N. J.: Prentice-Hall\n\n• Moravec, Hans (1988). Mind Children. Harvard University Press. ISBN 978-0-6745-7616-2. Archived from the original on 26 July 2020. Retrieved 18 November 2019.\n\n• Morgenstern, Michael (9 May 2015). \"Automation and anxiety\". The Economist. Archived from the original on 12 January 2018. Retrieved 13 January 2018.\n\n• Müller, Vincent C.; Bostrom, Nick (2014). \"Future Progress in Artificial Intelligence: A Poll Among Experts\". AI Matters. 1 (1): 9-11. doi:10.1145/2639475.2639478.\n\n• Neumann, Bernd; Möller, Ralf (January 2008). \"On scene interpretation with description logics\". Image and Vision Computing. 26 (1): 82-101. doi:10.1016/j. imavis.2007.08.013.\n\n• Nilsson, Nils (1995), \"Eyes on the Prize\", AI Magazine, vol. 16, pp. 9-17\n\n• Newell, Allen; Simon, H. A. (1976). \"Computer Science as Empirical Inquiry: Symbols and Search\". Communications of the ACM. 19 (3): 113-126. doi:10.1145/360018.360022.\n\n• Nicas, Jack (7 February 2018). \"How YouTube Drives People to the Internet's Darkest Corners\". The Wall Street Journal. ISSN 0099-9660. Archived from the original on 5 October 2024. Retrieved 16 June 2018.\n\n• Nilsson, Nils (1983). \"Artificial Intelligence Prepares for 2001\" (PDF). AI Magazine. 1 (1). Archived (PDF) from the original on 17 August 2020. Retrieved 22 August 2020. Presidential Address to the Association for the Advancement of Artificial Intelligence.\n\n• NRC (United States National Research Council) (1999). \"Developments in Artificial Intelligence\". Funding a Revolution: Government Support for Computing Research. National Academies Press. ISBN 978-0-309-52501-5.\n\n• Omohundro, Steve (2008). The Nature of Self-Improving Artificial Intelligence (PDF). 2007 Singularity Summit. San Francisco, CA.\n\n• Oudeyer, P-Y. (2010). \"On the impact of robotics in behavioral and cognitive sciences: from insect navigation to human cognitive development\". IEEE Transactions on Autonomous Mental Development. 2 (1): 2-16. Bibcode:2010ITAMD...2....2O. doi:10.1109/tamd.2009.2039057.\n\n• Pennachin, C.; Goertzel, B. (2007). \"Contemporary Approaches to Artificial General Intelligence\". Artificial General Intelligence. Cognitive Technologies. Berlin, Heidelberg: Springer. pp. 1-30. doi:10.1007/978-3-540-68677-4_1. ISBN 978-3-5402-3733-4.\n\n• Pinker, Steven (2007) [1994], The Language Instinct, Perennial Modern Classics, Harper, ISBN 978-0-0613-3646-1\n\n• Poria, Soujanya; Cambria, Erik; Bajpai, Rajiv; Hussain, Amir (September 2017). \"A review of affective computing: From unimodal analysis to multimodal fusion\". Information Fusion. 37: 98-125. Bibcode:2017InfFu..37...98P. doi:10.1016/j. inffus.2017.02.003. hdl:1893/25490.\n\n• Rawlinson, Kevin (29 January 2015). \"Microsoft's Bill Gates insists AI is a threat\". BBC News. Archived from the original on 29 January 2015. Retrieved 30 January 2015.\n\n• Reisner, Alex (19 August 2023), \"Revealed: The Authors Whose Pirated Books are Powering Generative AI\", The Atlantic, archived from the original on 3 October 2024, retrieved 5 October 2024\n\n• Roberts, Jacob (2016). \"Thinking Machines: The Search for Artificial Intelligence\". Distillations. Vol. 2, no. 2. pp. 14-23. Archived from the original on 19 August 2018. Retrieved 20 March 2018.\n\n• Robitzski, Dan (5 September 2018). \"Five experts share what scares them the most about AI\". Futurism. Archived from the original on 8 December 2019. Retrieved 8 December 2019.\n\n• Rose, Steve (11 July 2023). \"AI Utopia or dystopia?\". The Guardian Weekly. pp. 42-43.\n\n• Russell, Stuart (2019). Human Compatible: Artificial Intelligence and the Problem of Control. United States: Viking. ISBN 978-0-5255-5861-3. OCLC 1083694322.\n\n• Sainato, Michael (19 August 2015). \"Stephen Hawking, Elon Musk, and Bill Gates Warn About Artificial Intelligence\". Observer. Archived from the original on 30 October 2015. Retrieved 30 October 2015.\n\n• Sample, Ian (5 November 2017). \"Computer says no: why making AIs fair, accountable and transparent is crucial\". The Guardian. Archived from the original on 10 October 2022. Retrieved 30 January 2018.\n\n• Rothman, Denis (7 October 2020). \"Exploring LIME Explanations and the Mathematics Behind It\". Codemotion. Archived from the original on 25 November 2023. Retrieved 25 November 2023.\n\n• Scassellati, Brian (2002). \"Theory of mind for a humanoid robot\". Autonomous Robots. 12 (1): 13-24. doi:10.1023/A:1013298507114.\n\n• Schmidhuber, J. (2015). \"Deep Learning in Neural Networks: An Overview\". Neural Networks. 61: 85-117. arXiv:1404.7828. Bibcode:2015NN.....61...85S. doi:10.1016/j. neunet.2014.09.003. PMID 25462637.\n\n• Schmidhuber, Jürgen (2022). \"Annotated History of Modern AI and Deep Learning\". Archived from the original on 7 August 2023. Retrieved 5 October 2024.\n\n• Searle, John (1980). \"Minds, Brains and Programs\". Behavioral and Brain Sciences. 3 (3): 417-457. doi:10.1017/S0140525X00005756.\n\n• Searle, John (1999). Mind, language and society. New York: Basic Books. ISBN 978-0-4650-4521-1. OCLC 231867665. Archived from the original on 26 July 2020. Retrieved 22 August 2020.\n\n• Simon, H. A. (1965), The Shape of Automation for Men and Management, New York: Harper & Row, OCLC 1483817127\n\n• Simonite, Tom (31 March 2016). \"How Google Plans to Solve Artificial Intelligence\". MIT Technology Review. Archived from the original on 16 September 2024. Retrieved 5 October 2024.\n\n• Smith, Craig S. (15 March 2023). \"ChatGPT-4 Creator Ilya Sutskever on AI Hallucinations and AI Democracy\". Forbes. Archived from the original on 18 September 2024. Retrieved 25 December 2023.\n\n• Smoliar, Stephen W.; Zhang, HongJiang (1994). \"Content based video indexing and retrieval\". IEEE MultiMedia. 1 (2): 62-72. doi:10.1109/93.311653.\n\n• Solomonoff, Ray (1956). An Inductive Inference Machine (PDF). Dartmouth Summer Research Conference on Artificial Intelligence. Archived (PDF) from the original on 26 April 2011. Retrieved 22 March 2011 - via std. com, pdf scanned copy of the original. Later published as\n\nSolomonoff, Ray (1957). \"An Inductive Inference Machine\". IRE Convention Record. Vol. Section on Information Theory, part 2. pp. 56-62.\n\n• Stanford University (2023). \"Artificial Intelligence Index Report 2023/Chapter 6: Policy and Governance\" (PDF). AI Index. Archived (PDF) from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Stewart, Jon (9 October 2025). \"AI: What Could Go Wrong? With Geoffrey Hinton\". The Weekly Show with Jon Stewart (Podcast).\n\n• Tao, Jianhua; Tan, Tieniu (2005). Affective Computing and Intelligent Interaction. Affective Computing: A Review. Lecture Notes in Computer Science. Vol. 3784. Springer. pp. 981-995. doi:10.1007/11573548. ISBN 978-3-5402-9621-8.\n\n• Taylor, Josh; Hern, Alex (2 May 2023). \"'Godfather of AI' Geoffrey Hinton quits Google and warns over dangers of misinformation\". The Guardian. Archived from the original on 5 October 2024. Retrieved 5 October 2024.\n\n• Thompson, Derek (23 January 2014). \"What Jobs Will the Robots Take?\". The Atlantic. Archived from the original on 24 April 2018. Retrieved 24 April 2018.\n\n• Thro, Ellen (1993). Robotics: The Marriage of Computers and Machines. New York: Facts on File. ISBN 978-0-8160-2628-9. Archived from the original on 26 July 2020. Retrieved 22 August 2020.\n\n• Toews, Rob (3 September 2023). \"Transformers Revolutionized AI. What Will Replace Them?\". Forbes. Archived from the original on 8 December 2023. Retrieved 8 December 2023.\n\n• Turing, Alan (October 1950). \"Computing Machinery and Intelligence\". Mind. 59 (236): 433-460. doi:10.1093/mind/LIX.236.433. ISSN 1460-2113. JSTOR 2251299. S2CID 14636783.\n\n• UNESCO Science Report: the Race Against Time for Smarter Development. Paris: UNESCO. 2021. ISBN 978-9-2310-0450-6. Archived from the original on 18 June 2022. Retrieved 18 September 2021.\n\n• Urbina, Fabio; Lentzos, Filippa; Invernizzi, Cédric; Ekins, Sean (7 March 2022). \"Dual use of artificial-intelligence-powered drug discovery\". Nature Machine Intelligence. 4 (3): 189-191. doi:10.1038/s42256-022-00465-9. PMC 9544280. PMID 36211133.\n\n• Valance, Christ (30 May 2023). \"Artificial intelligence could lead to extinction, experts warn\". BBC News. Archived from the original on 17 June 2023. Retrieved 18 June 2023.\n\n• Valinsky, Jordan (11 April 2019), \"Amazon reportedly employs thousands of people to listen to your Alexa conversations\", CNN. com, archived from the original on 26 January 2024, retrieved 5 October 2024\n\n• Verma, Yugesh (25 December 2021). \"A Complete Guide to SHAP - SHAPley Additive exPlanations for Practitioners\". Analytics India Magazine. Archived from the original on 25 November 2023. Retrieved 25 November 2023.\n\n• Vincent, James (7 November 2019). \"OpenAI has published the text-generating AI it said was too dangerous to share\". The Verge. Archived from the original on 11 June 2020. Retrieved 11 June 2020.\n\n• Vincent, James (15 November 2022). \"The scary truth about AI copyright is nobody knows what will happen next\". The Verge. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Vincent, James (3 April 2023). \"AI is entering an era of corporate control\". The Verge. Archived from the original on 19 June 2023. Retrieved 19 June 2023.\n\n• Vinge, Vernor (1993). \"The Coming Technological Singularity: How to Survive in the Post-Human Era\". Vision 21: Interdisciplinary Science and Engineering in the Era of Cyberspace: 11. Bibcode:1993vise. nasa...11V. Archived from the original on 1 January 2007. Retrieved 14 November 2011.\n\n• Waddell, Kaveh (2018). \"Chatbots Have Entered the Uncanny Valley\". The Atlantic. Archived from the original on 24 April 2018. Retrieved 24 April 2018.\n\n• Wallach, Wendell (2010). Moral Machines. Oxford University Press.\n\n• Wason, P. C.; Shapiro, D. (1966). \"Reasoning\". In Foss, B. M. (ed.). New horizons in psychology. Harmondsworth: Penguin. Archived from the original on 26 July 2020. Retrieved 18 November 2019.\n\n• Weng, J.; McClelland; Pentland, A.; Sporns, O.; Stockman, I.; Sur, M.; Thelen, E. (2001). \"Autonomous mental development by robots and animals\". Science. 291 (5504): 599-600. doi:10.1126/science.291.5504.599. PMID 11229402.\n\n• \"What is 'fuzzy logic'? Are there computers that are inherently fuzzy and do not apply the usual binary logic?\". Scientific American. 21 October 1999. Archived from the original on 6 May 2018. Retrieved 5 May 2018.\n\n• Williams, Rhiannon (28 June 2023), \"Humans may be more likely to believe disinformation generated by AI\", MIT Technology Review, archived from the original on 16 September 2024, retrieved 5 October 2024\n\n• Wirtz, Bernd W.; Weyerer, Jan C.; Geyer, Carolin (24 July 2018). \"Artificial Intelligence and the Public Sector - Applications and Challenges\". International Journal of Public Administration. 42 (7): 596-615. doi:10.1080/01900692.2018.1498103.\n\n• Wong, Matteo (19 May 2023), \"ChatGPT Is Already Obsolete\", The Atlantic, archived from the original on 18 September 2024, retrieved 5 October 2024\n\n• Yudkowsky, E (2008), \"Artificial Intelligence as a Positive and Negative Factor in Global Risk\" (PDF), Global Catastrophic Risks, Oxford University Press, 2008, Bibcode:2008gcr.. book..303Y, archived (PDF) from the original on 19 October 2013, retrieved 24 September 2021\n\n## External links\n\nArtificial intelligence at Wikipedia's sister projects\n\n• Definitions from Wiktionary\n\n• Media from Commons\n\n• Quotations from Wikiquote\n\n• Textbooks from Wikibooks\n\n• Resources from Wikiversity\n\n• Data from Wikidata\n\nScholia has a topic profile for Artificial intelligence.\n\n• Hauser, Larry. \"Artificial Intelligence\". In Fieser, James; Dowden, Bradley (eds.). Internet Encyclopedia of Philosophy. ISSN 2161-0002. OCLC 37741658.\n\nshow\n\n• v\n\n• t\n\n• e\n\nArtificial intelligence (AI)\n\nshow\nArticles related to artificial intelligence\n\nshow\nAuthority control databases\n\nRetrieved from \"https://en. wikipedia. org/w/index. php? title=Artificial_intelligence&oldid=1336676724\"\n\nCategories:\n\n• Artificial intelligence\n\n• Computational fields of study\n\n• Computational neuroscience\n\n• Cybernetics\n\n• Data science\n\n• Formal sciences\n\n• Intelligence by type\n\nHidden categories:\n\n• Webarchive template wayback links\n\n• CS1 German-language sources (de)\n\n• CS1 Russian-language sources (ru)\n\n• CS1 Japanese-language sources (ja)\n\n• Articles with short description\n\n• Short description is different from Wikidata\n\n• Use dmy dates from October 2025\n\n• Wikipedia indefinitely semi-protected pages\n\n• Articles with excerpts\n\n• Pages displaying short descriptions of redirect targets via Module: Annotated link\n\n• CS1: long volume value\n\n• Pages using Sister project links with hidden wikidata\n\n• Articles with Internet Encyclopedia of Philosophy links",
        "metadata": {
          "hash": "85995bf6e781d5f6e7af61bda165aa1ba88d34f81cb95e685d04de3c40843b6d"
        },
        "sourceTrust": "medium",
        "fetchedAt": "2026-02-07T15:49:17.962Z"
      }
    },
    {
      "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
      "score": 0.7863993,
      "document": {
        "id": "72a5a62e-0315-4312-8bca-6ff4081c2083",
        "url": "https://httpbin.org/anything?t=1770485144640&unique=9o2ltd",
        "text": "{\n\"args\": {\n\"t\": \"1770485144640\",\n\"unique\": \"9o2ltd\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encoding\": \"gzip, deflate\",\n\"Accept-Language\": \"en-US, en; q=0.5\",\n\"Host\": \"httpbin. org\",\n\"Sec-Fetch-Mode\": \"cors\",\n\"User-Agent\": \"WIL-Crawler/1.0 (Web Intelligence Layer)\",\n\"X-Amzn-Trace-Id\": \"Root=1-6987759c-28fe22017399a313493f8d86\"\n},\n\"json\": null,\n\"method\": \"GET\",\n\"origin\": \"103.37.201.174\",\n\"url\": \"https://httpbin. org/anything? t=1770485144640&unique=9o2ltd\"\n}",
        "metadata": {
          "hash": "5b5de1adac7df917bb23163a219ecfcc86db184d5ea44fe544398df76cd6f55f"
        },
        "sourceTrust": "unknown",
        "fetchedAt": "2026-02-07T17:25:49.144Z"
      }
    },
    {
      "documentId": "12b7379d-1441-404a-a052-7488bf3394e9",
      "score": 0.7814375,
      "document": {
        "id": "12b7379d-1441-404a-a052-7488bf3394e9",
        "url": "https://httpbin.org/anything?t=1770490271120&unique=ydb0n5",
        "text": "{\n\"args\": {\n\"t\": \"1770490271120\",\n\"unique\": \"ydb0n5\"\n},\n\"data\": \"\",\n\"files\": {},\n\"form\": {},\n\"headers\": {\n\"Accept\": \"text/html, application/xhtml+xml, application/xml; q=0.9,*/*; q=0.8\",\n\"Accept-Encoding\": \"gzip, deflate\",\n\"Accept-Language\": \"en-US, en; q=0.5\",\n\"Host\": \"httpbin. org\",\n\"Sec-Fetch-Mode\": \"cors\",\n\"User-Agent\": \"WIL-Crawler/1.0 (Web Intelligence Layer)\",\n\"X-Amzn-Trace-Id\": \"Root=1-698789a7-43f49043549366c244d1e81b\"\n},\n\"json\": null,\n\"method\": \"GET\",\n\"origin\": \"47.15.118.47\",\n\"url\": \"https://httpbin. org/anything? t=1770490271120&unique=ydb0n5\"\n}",
        "metadata": {
          "hash": "815e6b80e21c36dd1d38dd85102e3489d1dfa682d8e215c609c6a12528ee8249"
        },
        "sourceTrust": "unknown",
        "fetchedAt": "2026-02-07T18:51:19.814Z"
      }
    }
  ],
  "count": 5
}
```

---

### 16. Get Leads

**Status:** ✅ PASS
**Duration:** 5ms

#### Request
```
GET http://localhost:3000/api/v1/leads?limit=10
```

#### Response (Status: 200)
```json
{
  "leads": [
    {
      "id": "914cafe4-7188-4667-992a-4dd8adc1b985",
      "documentId": "2faeb30f-ee83-4a7b-9df3-088fddc7a5a2",
      "score": "0.6300",
      "weights": {
        "freshness": 0.1499854453125,
        "sourceTrust": 0.13999999999999999,
        "llmConfidence": 0.24,
        "signalDensity": 0,
        "embeddingSimilarity": 0.1
      },
      "status": "review_needed",
      "reasonCodes": [
        "HIGH_LLM_CONFIDENCE",
        "RECENT_CONTENT",
        "LOW_SIGNAL_DENSITY"
      ],
      "createdAt": "2026-02-07T15:47:26.567Z"
    },
    {
      "id": "1c048793-7e4a-45f0-9a4f-c29e63facdcc",
      "documentId": "5a973f2f-d2f6-4f9d-87b1-5f48e42242b3",
      "score": "0.6300",
      "weights": {
        "freshness": 0.1499998761574074,
        "sourceTrust": 0.13999999999999999,
        "llmConfidence": 0.24,
        "signalDensity": 0,
        "embeddingSimilarity": 0.1
      },
      "status": "review_needed",
      "reasonCodes": [
        "HIGH_LLM_CONFIDENCE",
        "RECENT_CONTENT",
        "LOW_SIGNAL_DENSITY"
      ],
      "createdAt": "2026-02-07T15:49:00.696Z"
    },
    {
      "id": "7fedac29-4da2-4f6a-9e13-89c84e64809b",
      "documentId": "195e389d-be7c-4008-8809-3bde88cd0ec1",
      "score": "0.6300",
      "weights": {
        "freshness": 0.14999992893518518,
        "sourceTrust": 0.13999999999999999,
        "llmConfidence": 0.24,
        "signalDensity": 0,
        "embeddingSimilarity": 0.1
      },
      "status": "review_needed",
      "reasonCodes": [
        "HIGH_LLM_CONFIDENCE",
        "RECENT_CONTENT",
        "LOW_SIGNAL_DENSITY"
      ],
      "createdAt": "2026-02-07T15:49:19.192Z"
    },
    {
      "id": "0061acfd-d1ac-4568-b1ab-cdd9035f4be3",
      "documentId": "8b8010bd-6a0d-44e1-96a4-8f9401439a6b",
      "score": "0.4100",
      "weights": {
        "freshness": 0.14999994809027778,
        "sourceTrust": 0.04000000000000001,
        "llmConfidence": 0.12,
        "signalDensity": 0,
        "embeddingSimilarity": 0.1
      },
      "status": "review_needed",
      "reasonCodes": [
        "LOW_LLM_CONFIDENCE",
        "UNTRUSTED_SOURCE",
        "RECENT_CONTENT",
        "LOW_SIGNAL_DENSITY"
      ],
      "createdAt": "2026-02-07T15:52:40.292Z"
    },
    {
      "id": "0cbb2e77-36c4-4f3d-89ef-c5408899b27e",
      "documentId": "72a5a62e-0315-4312-8bca-6ff4081c2083",
      "score": "0.3500",
      "weights": {
        "freshness": 0.14999948940972221,
        "sourceTrust": 0.04000000000000001,
        "llmConfidence": 0.06,
        "signalDensity": 0,
        "embeddingSimilarity": 0.1
      },
      "status": "review_needed",
      "reasonCodes": [
        "LOW_LLM_CONFIDENCE",
        "UNTRUSTED_SOURCE",
        "RECENT_CONTENT",
        "LOW_SIGNAL_DENSITY"
      ],
      "createdAt": "2026-02-07T17:25:57.968Z"
    },
    {
      "id": "f3b97c91-dc9f-41d0-b222-e086906a484c",
      "documentId": "12b7379d-1441-404a-a052-7488bf3394e9",
      "score": "0.3500",
      "weights": {
        "freshness": 0.1499992042824074,
        "sourceTrust": 0.04000000000000001,
        "llmConfidence": 0.06,
        "signalDensity": 0,
        "embeddingSimilarity": 0.1
      },
      "status": "review_needed",
      "reasonCodes": [
        "LOW_LLM_CONFIDENCE",
        "UNTRUSTED_SOURCE",
        "RECENT_CONTENT",
        "LOW_SIGNAL_DENSITY"
      ],
      "createdAt": "2026-02-07T18:51:33.565Z"
    }
  ],
  "count": 6
}
```

---

