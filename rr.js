const fs = require('fs');

const data = fs.readFileSync('./a.json', 'utf8');
const dayjs = require('dayjs');
const {
    cp
} = require('fs/promises');
const json = JSON.parse(data)

const graph = {
    nodes: [],
    edges: [],
}

let firstDate = "2030-10-10";
let lastDate = "1965-10-10";

const TEST = 86

json.forEach((item, i) => {
    if (i>TEST) {
        return;
    }
    const existingItem = graph.nodes.find(node => node.id === item.id);
    const nbRetweets = item.retweetCount;

    if (item.quotedTweet) {

    } else if (item.retweetedTweet) {

    } else {
        if (nbRetweets >= 1) {
            graph.nodes.push({
                id: `${item.user.username}`,
                label: `@${item.user.username}`,
                "x": 193 + Math.random() * 1000,
                "y": 175 + Math.random() * 1000,
                metadata: {
                    "date": item.date,
                    "tweets": [
                        item.url
                    ]
                },
                "size": nbRetweets,
            })
            delete json[i];
        }
    }

    if (dayjs(item.date).isBefore(firstDate)) {
        firstDate = item.date
    }
    if (dayjs(item.date).isAfter(lastDate)) {
        lastDate = item.date
    }
});

json.forEach((item, i) => {
    if (i>TEST) {
        return;
    }
    if (item.quotedTweet) {
        const existingItem = graph.nodes.find(node => node.id === item.quotedTweet.user.username);
        if (!existingItem) {
            graph.nodes.push({
                id: `${item.quotedTweet.user.username}`,
                label: `@${item.quotedTweet.user.username}`,
                "x": 193 + Math.random() * 1000,
                "y": 175 + Math.random() * 1000,
                metadata: {
                    "date": item.date,
                },
                "size": 1,
            })
        }
        const existingItem2 = graph.nodes.find(node => node.id === item.user.username);
        if (!existingItem2) {
            graph.nodes.push({
                id: `${item.user.username}`,
                label: `@${item.user.username}`,
                "x": 193 + Math.random() * 1000,
                "y": 175 + Math.random() * 1000,
                metadata: {
                    "date": item.date,
                },
                "size": 1,
            })
        }

            const existing = graph.edges.find(({
                target,
                source
            }) => target === item.user.username && source === item.quotedTweet.user.username)
            if (existing) {
                existing.size += 1;
            } else {
                graph.edges.push({
                    "target": item.user.username,
                    "source": item.quotedTweet.user.username,
                    'label': "has quoted",
                    "attributes": {},
                    "size": 1.0,
                    "id": `edge_${i}`
                })
            }

    } else if (item.retweeted) {
        const existingItem = graph.nodes.find(node => node.id === item.retweeted.user.username);
        if (!existingItem) {
            graph.nodes.push({
                id: `${item.retweeted.user.username}`,
                label: `@${item.retweeted.user.username}`,
                "x": 193 + Math.random() * 1000,
                "y": 175 + Math.random() * 1000,
                metadata: {
                    "date": item.date,
                },
                "size": 1,
            })
        }
        const existingItem2 = graph.nodes.find(node => node.id === item.user.username);
        if (!existingItem2) {
            graph.nodes.push({
                id: `${item.user.username}`,
                label: `@${item.user.username}`,
                "x": 193 + Math.random() * 1000,
                "y": 175 + Math.random() * 1000,
                metadata: {
                    "date": item.date,
                },
                "size": 1,
            })
        }
            const existing = graph.edges.find(({
                target,
                source
            }) => target === item.user.username && source === item.retweeted.user.username)
            if (existing) {
                existing.size += 1;
            } else {
                graph.edges.push({
                    "target": item.user.username,
                    "source": item.retweeted.user.username,
                    'label': "has retweeted",
                    "attributes": {},
                    "size": 1.0,
                    "id": `edge_${i}`
                })
            }

    }
});


//     // if (
//     //     item.retweetedTweet &&item.retweetedTweet.user.username === "fallofthefranks"
//     //     || item.quotedTweet &&item.quotedTweet.user.username === "fallofthefranks"
//     //     || item &&item.user.username === "fallofthefranks"
//     //     ) {
//     //     console.log(item)
//     // }


//     const existingRetweet = item.retweetedTweet && graph.nodes.find(({
//         id
//     }) => item.retweetedTweet.user.username === id);
//     if (item.retweetedTweet && !existingRetweet) {
//         console.log("Add retweetedTweet");

//         graph.nodes.push({
//             "label": `@${item.retweetedTweet.user.username}`,
//             "x": 193 + Math.random() * 1000,
//             "y": 175 + Math.random() * 1000,
//             "id": item.retweetedTweet.user.username,
//             "attributes": {
//                 "Modularity Class": "80"
//             },
//             metadata: {
//                 "date": item.retweetedTweet.date
//             },
//             "size": item.retweetedTweet.retweetCount
//         })
//     } else if (existingRetweet) {
//         existingRetweet.size += item.retweetedTweet.retweetCount || 1
//         existingRetweet.date = item.retweetedTweet.date
//     }

//     const existingQuote = item.quotedTweet && graph.nodes.find(({
//         id
//     }) => item.quotedTweet.user.username === id);
//     if (item.quotedTweet && !existingQuote) {
//         console.log("Add quotedTweet");
//         graph.nodes.push({
//             "label": `@${item.quotedTweet.user.username}`,
//             "x": 193 + Math.random() * 1000,
//             "y": 175 + Math.random() * 1000,
//             "id": item.quotedTweet.user.username,
//             "attributes": {
//                 "Modularity Class": "80"
//             },
//             metadata: {
//                 "date": item.quotedTweet.date
//             },
//             "size": item.quotedTweet.retweetCount
//         })
//     } else if (item.quotedTweet) {
//         existingQuote.size += item.quotedTweet.retweetCount || 1;
//         existingQuote.date = item.quotedTweet.date;
//     }

//     const node = graph.nodes.find(({
//         id
//     }) => item.user.username === id)
//     if (!node) {
//         console.log("Add user");
//         graph.nodes.push({
//             "label": `@${item.user.username}`,
//             "x": 193 + Math.random() * 1000,
//             "y": 175 + Math.random() * 1000,
//             "id": item.user.username,
//             "attributes": {
//                 "Modularity Class": "80"
//             },
//             metadata: {
//                 "date": item.date
//             },
//             "size": item.retweetCount || 1
//         })
//     } else {
//         node.size += item.retweetCount || 1
//         node.date = item.date
//     }


//     if (item.retweetedTweet) {
//         const existing = graph.edges.find(({
//             target,
//             source
//         }) => target === item.user.username && source === item.retweetedTweet.user.username)
//         if (existing) {
//             existing.size += 1;
//         } else {

//             graph.edges.push({
//                 "target": item.user.username,
//                 "source": item.retweetedTweet.user.username,
//                 'label': "has retweeted",
//                 "attributes": {},
//                 "size": 1.0,
//                 "id": `edge_${i}`
//             })
//         }
//     }
//     if (item.quotedTweet) {
//         const existing = graph.edges.find(({
//             target,
//             source
//         }) => target === item.user.username && source === item.quotedTweet.user.username)
//         if (existing) {
//             existing.size += 1;
//         } else {

//             graph.edges.push({
//                 "target": item.user.username,
//                 "source": item.quotedTweet.user.username,
//                 'label': "has quoted",
//                 "attributes": {},
//                 "size": 1.0,
//                 "id": `edge_${i}`
//             })
//         }
//     }
// })


fs.writeFileSync('./public/test2.json', JSON.stringify(graph, null, 2), 'utf8')
console.log(''); //eslint-disable-line
console.log('╔════START══graph══════════════════════════════════════════════════'); //eslint-disable-line
console.log(JSON.stringify(graph)); //eslint-disable-line
console.log(firstDate); //eslint-disable-line
console.log(lastDate); //eslint-disable-line
console.log('╚════END════graph══════════════════════════════════════════════════'); //eslint-disable-line