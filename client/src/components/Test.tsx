import React from 'react';

interface Gist {
  id: number;
  title: string;
  parentId: number | null;
  createdAt: string;
  children?: Gist[];
}

interface CommentProps {
  gist: Gist;
}

const gistData =  [
      {
        "id": 1,
        "title": "First Gist",
        "parentId": null,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 1,
            "point": "Version 1 of Gist 1",
            "edits": [
              {
                "id": 1,
                "body": "Edit 1 of Version 1 of Gist 1"
              },
              {
                "id": 2,
                "body": "Edit 2 of Version 1 of Gist 1"
              }
            ]
          },
          {
            "id": 2,
            "point": "Version 2 of Gist 1",
            "edits": [
              {
                "id": 3,
                "body": "Edit 1 of Version 2 of Gist 1"
              },
              {
                "id": 4,
                "body": "Edit 2 of Version 2 of Gist 1"
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "title": "Second Gist",
        "parentId": null,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 3,
            "point": "Version 1 of Gist 2",
            "edits": [
              {
                "id": 5,
                "body": "Edit 1 of Version 1 of Gist 2"
              },
              {
                "id": 6,
                "body": "Edit 2 of Version 1 of Gist 2"
              }
            ]
          },
          {
            "id": 4,
            "point": "Version 2 of Gist 2",
            "edits": [
              {
                "id": 7,
                "body": "Edit 1 of Version 2 of Gist 2"
              },
              {
                "id": 8,
                "body": "Edit 2 of Version 2 of Gist 2"
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "title": "Third Gist",
        "parentId": null,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 5,
            "point": "Version 1 of Gist 3",
            "edits": [
              {
                "id": 9,
                "body": "Edit 1 of Version 1 of Gist 3"
              },
              {
                "id": 10,
                "body": "Edit 2 of Version 1 of Gist 3"
              }
            ]
          },
          {
            "id": 6,
            "point": "Version 2 of Gist 3",
            "edits": [
              {
                "id": 11,
                "body": "Edit 1 of Version 2 of Gist 3"
              },
              {
                "id": 12,
                "body": "Edit 2 of Version 2 of Gist 3"
              }
            ]
          }
        ]
      },
      {
        "id": 4,
        "title": "Nested Gist Level 1 for Gist 1",
        "parentId": 1,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 7,
            "point": "Version 1 of Gist 4",
            "edits": [
              {
                "id": 13,
                "body": "Edit 1 of Version 1 of Gist 4"
              },
              {
                "id": 14,
                "body": "Edit 2 of Version 1 of Gist 4"
              }
            ]
          },
          {
            "id": 8,
            "point": "Version 2 of Gist 4",
            "edits": [
              {
                "id": 15,
                "body": "Edit 1 of Version 2 of Gist 4"
              },
              {
                "id": 16,
                "body": "Edit 2 of Version 2 of Gist 4"
              }
            ]
          }
        ]
      },
      {
        "id": 5,
        "title": "Nested Gist Level 2 for Gist 1",
        "parentId": 4,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 9,
            "point": "Version 1 of Gist 5",
            "edits": [
              {
                "id": 17,
                "body": "Edit 1 of Version 1 of Gist 5"
              },
              {
                "id": 18,
                "body": "Edit 2 of Version 1 of Gist 5"
              }
            ]
          },
          {
            "id": 10,
            "point": "Version 2 of Gist 5",
            "edits": [
              {
                "id": 19,
                "body": "Edit 1 of Version 2 of Gist 5"
              },
              {
                "id": 20,
                "body": "Edit 2 of Version 2 of Gist 5"
              }
            ]
          }
        ]
      },
      {
        "id": 6,
        "title": "Nested Gist Level 3 for Gist 1",
        "parentId": 5,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 11,
            "point": "Version 1 of Gist 6",
            "edits": [
              {
                "id": 21,
                "body": "Edit 1 of Version 1 of Gist 6"
              },
              {
                "id": 22,
                "body": "Edit 2 of Version 1 of Gist 6"
              }
            ]
          },
          {
            "id": 12,
            "point": "Version 2 of Gist 6",
            "edits": [
              {
                "id": 23,
                "body": "Edit 1 of Version 2 of Gist 6"
              },
              {
                "id": 24,
                "body": "Edit 2 of Version 2 of Gist 6"
              }
            ]
          }
        ]
      },
      {
        "id": 7,
        "title": "Nested Gist Level 4 for Gist 1",
        "parentId": 6,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 13,
            "point": "Version 1 of Gist 7",
            "edits": [
              {
                "id": 25,
                "body": "Edit 1 of Version 1 of Gist 7"
              },
              {
                "id": 26,
                "body": "Edit 2 of Version 1 of Gist 7"
              }
            ]
          },
          {
            "id": 14,
            "point": "Version 2 of Gist 7",
            "edits": [
              {
                "id": 27,
                "body": "Edit 1 of Version 2 of Gist 7"
              },
              {
                "id": 28,
                "body": "Edit 2 of Version 2 of Gist 7"
              }
            ]
          }
        ]
      },
      {
        "id": 8,
        "title": "Nested Gist Level 5 for Gist 1",
        "parentId": 7,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 15,
            "point": "Version 1 of Gist 8",
            "edits": [
              {
                "id": 29,
                "body": "Edit 1 of Version 1 of Gist 8"
              },
              {
                "id": 30,
                "body": "Edit 2 of Version 1 of Gist 8"
              }
            ]
          },
          {
            "id": 16,
            "point": "Version 2 of Gist 8",
            "edits": [
              {
                "id": 31,
                "body": "Edit 1 of Version 2 of Gist 8"
              },
              {
                "id": 32,
                "body": "Edit 2 of Version 2 of Gist 8"
              }
            ]
          }
        ]
      },
      {
        "id": 9,
        "title": "Nested Gist Level 1 for Gist 2",
        "parentId": 2,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 17,
            "point": "Version 1 of Gist 9",
            "edits": [
              {
                "id": 33,
                "body": "Edit 1 of Version 1 of Gist 9"
              },
              {
                "id": 34,
                "body": "Edit 2 of Version 1 of Gist 9"
              }
            ]
          },
          {
            "id": 18,
            "point": "Version 2 of Gist 9",
            "edits": [
              {
                "id": 35,
                "body": "Edit 1 of Version 2 of Gist 9"
              },
              {
                "id": 36,
                "body": "Edit 2 of Version 2 of Gist 9"
              }
            ]
          }
        ]
      },
      {
        "id": 10,
        "title": "Nested Gist Level 2 for Gist 2",
        "parentId": 9,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 19,
            "point": "Version 1 of Gist 10",
            "edits": [
              {
                "id": 37,
                "body": "Edit 1 of Version 1 of Gist 10"
              },
              {
                "id": 38,
                "body": "Edit 2 of Version 1 of Gist 10"
              }
            ]
          },
          {
            "id": 20,
            "point": "Version 2 of Gist 10",
            "edits": [
              {
                "id": 39,
                "body": "Edit 1 of Version 2 of Gist 10"
              },
              {
                "id": 40,
                "body": "Edit 2 of Version 2 of Gist 10"
              }
            ]
          }
        ]
      },
      {
        "id": 11,
        "title": "Nested Gist Level 3 for Gist 2",
        "parentId": 10,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 21,
            "point": "Version 1 of Gist 11",
            "edits": [
              {
                "id": 41,
                "body": "Edit 1 of Version 1 of Gist 11"
              },
              {
                "id": 42,
                "body": "Edit 2 of Version 1 of Gist 11"
              }
            ]
          },
          {
            "id": 22,
            "point": "Version 2 of Gist 11",
            "edits": [
              {
                "id": 43,
                "body": "Edit 1 of Version 2 of Gist 11"
              },
              {
                "id": 44,
                "body": "Edit 2 of Version 2 of Gist 11"
              }
            ]
          }
        ]
      },
      {
        "id": 12,
        "title": "Nested Gist Level 4 for Gist 2",
        "parentId": 11,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 23,
            "point": "Version 1 of Gist 12",
            "edits": [
              {
                "id": 45,
                "body": "Edit 1 of Version 1 of Gist 12"
              },
              {
                "id": 46,
                "body": "Edit 2 of Version 1 of Gist 12"
              }
            ]
          },
          {
            "id": 24,
            "point": "Version 2 of Gist 12",
            "edits": [
              {
                "id": 47,
                "body": "Edit 1 of Version 2 of Gist 12"
              },
              {
                "id": 48,
                "body": "Edit 2 of Version 2 of Gist 12"
              }
            ]
          }
        ]
      },
      {
        "id": 13,
        "title": "Nested Gist Level 1 for Gist 3",
        "parentId": 3,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 25,
            "point": "Version 1 of Gist 13",
            "edits": [
              {
                "id": 49,
                "body": "Edit 1 of Version 1 of Gist 13"
              },
              {
                "id": 50,
                "body": "Edit 2 of Version 1 of Gist 13"
              }
            ]
          },
          {
            "id": 26,
            "point": "Version 2 of Gist 13",
            "edits": [
              {
                "id": 51,
                "body": "Edit 1 of Version 2 of Gist 13"
              },
              {
                "id": 52,
                "body": "Edit 2 of Version 2 of Gist 13"
              }
            ]
          }
        ]
      },
      {
        "id": 14,
        "title": "Nested Gist Level 2 for Gist 3",
        "parentId": 13,
        "createdAt": "2023-09-20T05:19:12.686Z",
        "versions": [
          {
            "id": 27,
            "point": "Version 1 of Gist 14",
            "edits": [
              {
                "id": 53,
                "body": "Edit 1 of Version 1 of Gist 14"
              },
              {
                "id": 54,
                "body": "Edit 2 of Version 1 of Gist 14"
              }
            ]
          },
          {
            "id": 28,
            "point": "Version 2 of Gist 14",
            "edits": [
              {
                "id": 55,
                "body": "Edit 1 of Version 2 of Gist 14"
              },
              {
                "id": 56,
                "body": "Edit 2 of Version 2 of Gist 14"
              }
            ]
          }
        ]
      }
    ]
  



function groupGistsByParent(gists: any) {
  // Create a map where each gist's id is a key for quick access
  const gistsById = gists.reduce((map: any, gist: any) => {
    map[gist.id] = { ...gist, children: [] };
    return map;
  }, {});

  // Initialize an array to hold the top-level (root) gists
  const rootGists: any = [];

  // Loop through the gists and place each one in the appropriate position
  gists.forEach((gist: any) => {
    if (gist.parentId === null) {
      // Top-level gist (no parent), so add it to the root array
      rootGists.push(gistsById[gist.id]);
    } else if (gistsById[gist.parentId]) {
      // Add gist to its parent's 'children' array
      gistsById[gist.parentId].children.push(gistsById[gist.id]);
    }
  });
  console.log("root gists are ", rootGists)
  return rootGists;
  
}

const groupedData =  groupGistsByParent(gistData)

const Comment: React.FC<CommentProps> = ({ gist }) => {
  return (
    <div style={{ marginLeft: gist.parentId ? '20px' : '0px', padding: '10px', borderLeft: gist.parentId ? '1px solid #ccc' : 'none' }}>
      <div>
        <strong>{gist.title}</strong> <span>({new Date(gist.createdAt).toLocaleString()})</span>
      </div>
      <div style={{ marginLeft: '10px', marginTop: '5px' }}>
        {gist.children && gist.children.length > 0 && (
          <div>
            {gist.children.map((child) => (
              <Comment key={child.id} gist={child} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface CommentListProps {
  groupedData: Gist[];
}

const CommentList: React.FC<CommentListProps> = ({groupedData }) => {
  return (
    <div>
      {groupedData.map((gist: Gist) => (
        <Comment key={gist.id} gist={gist} />
      ))}
    </div>
  );
};

// Example usage
const groupedGists: Gist[] = [
  {
    id: 1,
    title: 'First Gist',
    parentId: null,
    createdAt: '2023-09-20T03:05:30.171Z',
    children: [
      {
        id: 3,
        title: 'first reply',
        parentId: 1,
        createdAt: '2023-09-21T03:05:30.171Z',
        children: [
          {
            id: 5,
            title: '1 reply for first reply',
            parentId: 3,
            createdAt: '2023-10-20T03:05:30.171Z',
            children: [
              {
                id: 7,
                title: '4th nested for 1 reply.',
                parentId: 5,
                createdAt: '2023-11-20T03:05:30.171Z',
                children: [],
              },
            ],
          },
          {
            id: 6,
            title: '2 reply of first reply',
            parentId: 3,
            createdAt: '2023-10-25T03:05:30.171Z',
            children: [],
          },
        ],
      },
      {
        id: 4,
        title: 'second reply',
        parentId: 1,
        createdAt: '2023-09-22T03:05:30.171Z',
        children: [],
      },
    ],
  },
  {
    id: 2,
    title: 'Second Gist',
    parentId: null,
    createdAt: '2023-09-20T03:05:30.171Z',
    children: [],
  },
];

const Test: React.FC = () => {
  return (
    <div>
      <h1>Nested Comments</h1>
      <CommentList groupedData={groupedData} />
    </div>
  );
};

export default Test;