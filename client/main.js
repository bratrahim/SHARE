import {Template} from 'meteor/templating';

Meteor.subscribe('posts');

Template.postFeed.helpers(
    {
        posts: function () {
            return Posts.find({}, {sort: {submitted: -1}});
        }
    });

Template.post_card.helpers(
    {
        //query for counting likes
        likes: function () {
            return Posts.find({_id: this._id},{liked: {$exists:true}}).count();
        }
    }
);

Template.post_card.events({
    "click .likeButton": function (parentContext) {
        Posts.update({_id: this._id}, {$push: {liked: {userID: Meteor.userId()}}});
    }
});

Template.postSubmit.events({
    "submit form": function (e) {
        e.preventDefault();

        var post = {
            img: $(e.target).find('[name=imageUrl]').val(),
            description: $(e.target).find('[name=description]').val()
        };
        Meteor.call('postInsert', post, function (error, result) {
            if (error)
                return alert(error.reason);
            Router.go('postpage', {_id: result._id});
        })
    }
});