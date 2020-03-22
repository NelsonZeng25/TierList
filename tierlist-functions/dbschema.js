let db = {
    users: [
        {
            userId: "dsandjsnkldnsa",
            email: "user@email.com",
            userName: "Nelson",
            createdAt: "2019-03-15T10:59:52.789Z",
            imageUrl: 'Nelson.png',
            bio: 'Hello my name Jeff',
            website: 'google.com',
            location: 'London, UK'
        },
        {
            userId: "nnnmdasmmlsadl",
            email: "lebron@email.com",
            userName: "Lebron",
            createdAt: "2019-03-15T10:59:52.789Z",
            imageUrl: 'Lebron.png',
            bio: 'Hello my name Lebron',
            website: 'google.com',
            location: 'London, UK'
        }
    ],
    managers: [
        {
            email: 'user@email.com',
            userId: 'dsandjsnkldnsa',
            imageUrl: 'Nelson.png',
            userName: "Nelson"
        }
    ],
    categories: [
        {
            name: 'MOVIE'
        },
        {
            name: 'ANIME'
        }
    ],
    tierLists: [
        {
            name: 'Best Tier List Ever',
            userName: 'Nelson',
            userId: 'dsandjsnkldnsa',
            userImage: 'Nelson.png',
            category: 'MOVIE',
            likeCount: 3,
            commentCount: 3,
            tierItems: {
                [TierId1]: {
                    name: 'Space Jam',
                    imageUrl: 'SpaceJam.png',
                    category: 'MOVIE',
                    score: 8,
                    pros: ["Good Animation", "Good pacing"],
                    cons: ["Bad plot", "Bad Characters"],
                    thoughts: "It was a OK movie",
                },
                [TierId2]: {
                    name: 'Cats',
                    imageUrl: 'Cats.png',
                    category: 'MOVIE',
                    score: 10,
                    pros: ["AMAZING CGI"],
                    cons: ["NO CONS", "BEST MOVIE EVER"],
                    thoughts: "Best movie",
                },
            }
        }
    ],
    tierItems: [
        {
            name: 'Space Jam',
            imageUrl: 'SpaceJam.png',
            category: 'MOVIE',
            userId: 'dsandjsnkldnsa'
        },
        {
            name: 'Cats',
            imageUrl: 'Cats.png',
            category: 'MOVIE',
            userId: 'dsandjsnkldnsa'
        },
    ],
    comments: [
        {
            body: 'This is the comment',
            createdAt: '2020-03-19T04:55:51.403Z',
            tierListId: 'dsajkbjbagk',
            userName: 'Nelson',
            userId: 'dsandjsnkldnsa',
            userImage: 'Nelson.png',
            likeCount: 0,
            replyCount: 2,
        }
    ],
    replies: [
        {
            body: 'Nice comment bro',
            createdAt: '2020-03-19T04:55:51.403Z',
            commentId: 'dsajkbjbagk',
            userName: 'Nelson',
            userId: 'dsandjsnkldnsa',
            userImage: 'Nelson.png',
            likeCount: 0,
        }
    ],
    notifications: [
        {
            recipientName: '',
            recipientId: 'adfafasfsasf',
            senderName: 'john',
            senderId: 'dasddasd',
            read: 'true | false',
            itemId: 'dankdnsla',
            type: 'like | comment | reply',
            createdAt: '2019-03-19T10:20:44.444Z'
        }
    ]
};

const userDetails = {
    // Redux data
    credentials: {
        userId: 'das',
        email: '',
        userName: '',
        createdAt: '',
        imageUrl: '',
        bio: '',
        website: '',
        location: '',
    },
    likes: [
        {
            userName: 'user',
            tierListId: 'dadasdsad',
        },
        {
            userName: 'user',
            tierListId: 'dasdad'
        }
    ]
}