/**
 * Created by admin on 5/14/2017.
 */
Posts = new Mongo.Collection('posts');

/*if (Posts.find().count() === 0) {
    Posts.insert({
        img: "https://images.pexels.com/photos/207385/pexels-photo-207385.jpeg?w=940&h=650&auto=compress&cs=tinysrgb",
        username: 'Introducing Telescope',
        description: 'http://sachagreif.com/introducing-telescope/'
    });
    Posts.insert({
        img: "https://images.pexels.com/photos/207385/pexels-photo-207385.jpeg?w=940&h=650&auto=compress&cs=tinysrgb",
        username: 'Introducing Telescope',
        description: 'http://sachagreif.com/introducing-telescope/'
    });
    Posts.insert({
        img: 'https://images.pexels.com/photos/206529/pexels-photo-206529.jpeg?w=940&h=650&auto=compress&cs=tinysrgb',
        description: 'http://sachagreif.com/introducing-telescope/',
        username: "Arina",
        number_of_comments: 83,
        likes: 50,
    });
}*/

Posts.allow({
    'update': function (userId, doc) {
        /* user and doc checks ,
         return true to allow insert */
        return !! userId;
    },
    'insert': function (userId, doc) {
        /* user and doc checks ,
         return true to allow insert */
        return !! userId;
    }
});

Meteor.methods({
    postInsert: function (postAttributes) {
        check(Meteor.userId(), String);
        check(postAttributes, {
            img: String,
            description: String,
        });


        var user = Meteor.user();
        var post = _.extend(postAttributes, {userId: user._id, author: user.username, submitted: new Date(),liked:[],comments:[]});

        var postId = Posts.insert(post);

        return {
            _id: postId
        };
    }
});