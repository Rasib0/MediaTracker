
db.createCollection("my_classes", {
    validator: {
        $jsonSchema: {
            bsonType: "array",
            title: "Classes Validation",
            items: {
                bsonType: "object",
                title: "Class Validation",
                required: ["course"],
                properties: {
                    "course": {
                        bsonType: "object",
                        title: "Course Validation",
                        required: [],
                        properties: {
                            "_id": { bsonType: "string", pattern: "^[A-Z]{3}[0-9]{3}$" },
                            "title": { bsonType: "string" },
                            "trimester": { bsonType: "number", enum: [1, 2, 3] },

                            "lecturers": {
                                bsonType: "array", item: {
                                    bsonType: "object",
                                    title: "Lecturer Validation",
                                    properties: {
                                        "lecId": { bsonType: "string" },
                                        "name": { bsonType: "string" },
                                        "role": { bsonType: "string", enum: ["coordinator", "lecturer", "guest"] },
                                    }
                                }
                            },
                            "students": {
                                bsonType: "array", item: {
                                    bsonType: "object",
                                    title: "Students Validation",
                                    properties: {
                                        "stuId": {bsonType: "string"},
                                        "name": {bsonType: "string"},
                                        "interm": {bsonType: "number"},
                                    }
                                }
                            },
                            "streams": { bsonType: "number" },
                        },
                        additionalProperties: false,
                    }
                },
            },
        }
    }
})


const input = {
    "my_classes":
    [
      {
        "_id": "CSE123_1",
        "course":
        {
          "code": "CSE123",
          "title": "Automata",
          "prerequisites": ["CSE101", "CSE102"],
          "stream": 1,
          "lecturers":
          [
            {
              "lecID": "007",
              "name": "Jibran",
              "role": "Coordinator"
            },
            {
              "lecID": "008",
              "name": "Imran",
              "role": "Lecturer"
            }
          ],
          "students":
          [
            {
              "stuID": "001",
              "name": "Rasib",
              "interm": 10
            },
            {
              "stuID": "002",
              "name": "Danial",
              "interm": 20
            }
          ]
        }
      }
    ]
  }