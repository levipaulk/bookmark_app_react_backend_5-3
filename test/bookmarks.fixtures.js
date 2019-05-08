function makeBookmarksArray() {
    return [
        {
            id: 1,
            title: "Test Title 1",
            url: "https://www.test1.com",
            description: "Test Desc 1",
            rating: 1
        },
        {
            id: 2,
            title: "Test Title 2",
            url: "https://www.test2.com",
            description: "Test Desc 2",
            rating: 2
        },
        {
            id: 3,
            title: "Test Title 3",
            url: "https://www.test3.com",
            description: "Test Desc 3",
            rating: 3
        },
    ]
}

module.exports = {
    makeBookmarksArray,
}