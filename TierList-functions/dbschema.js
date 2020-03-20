let db = {
    users: [
        {
            userId: "dsandjsnkldnsa",
            email: "user@email.com",
            userName: "Nelson",
            createdAt: "2019-03-15T10:59:52.789Z",
            imageUrl: 'image/dsadass',
            bio: 'Hello my name Jeff',
            website: 'dsadas',
            location: 'London, UK'
        }
    ],
    tierLists: [
        {
            name: 'user',
            likeCount: 3,
            commentCount: 3,
            SRank : [
                {
                    ...tierItems[0],
                    pros: 'Great animation',
                    cons: 'Story is ass',
                    thoughts: 'In general, this is show is actually pretty decent'
                }
            ],
            ARank: [],
            BRank: [],
            CRank: [],
            DRank: [],
            FRank: [],
        }
    ],
    tierItems: [
        {
            id: 'dsamdasm',
            name: 'Space Jam',
            imageUrl: 'image/dadeafaef',
        }
    ],
    comments: [
        {
            tierListId: 'dsadsadas',
            userName: 'user',
            userId: 'dads',
            body: 'This is the comment',
            createdAt: '2020-03-19T04:55:51.403Z',
            likeCount: 5,
            replyCount: 2,
        }
    ],
    notifications: [
        {
            recipientName: 'user',
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