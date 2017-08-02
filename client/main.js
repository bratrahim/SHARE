import {Template} from 'meteor/templating';

Meteor.subscribe('posts');
Meteor.subscribe('users');

Template.postFeed.helpers(
    {
        posts: function () {
            return Posts.find({}, {sort: {submitted: -1}});
        }
    });


Template.comment.helpers(
    {
        username: function () {
            return Meteor.users.findOne({_id: this.userId}).username;
        },
        date: function () {
            return moment(this.timestamp).fromNow();

        },
        profileimage: function () {
            return Meteor.users.findOne({_id: this.userId}).profile.image;
        }
    }
);

Template.post_card.helpers(
    {
        //query for counting likes
        likes: function () {
            var post = Posts.findOne({_id: this._id});
            return post.liked.length;
        },
        numberofcomments: function () {
            var post = Posts.findOne({_id: this._id});
            return post.comments.length;
        },
        buttoncolor: function () {
            var post = Posts.findOne({_id: this._id});
            if (post.liked.includes(Meteor.userId()))
            {
                return "green";
            }
            return "red"
        },
    }
);

Template.post_card.events({
    "click .likeButton": function (parentContext) {
        if (Meteor.userId()) {
            var post = Posts.findOne({_id: this._id});
            var setOfIds = post.liked;
            if (setOfIds.includes(Meteor.userId())) {
                //do on server side
                Posts.update({_id: this._id}, {$pull: {liked: String(Meteor.userId())}});
            }
            else {
                //do on server side
                Posts.update({_id: this._id}, {$push: {liked: String(Meteor.userId())}});
            }
        }
    },
    "click .commentSubmit": function (parentContext) {
        var comment = $('.comment-textarea').val();
        //do on server side
        Posts.update({_id: this._id}, {
            $push: {
                comments: {
                    userId: String(Meteor.userId()),
                    timestamp: new Date(),
                    comment: comment
                }
            }
        });
    }
});

Template.postSubmit.rendered= function () {
    $('.dropdown-button').dropdown();
};

Template.postSubmit.events({
    "submit form": function (e) {
        e.preventDefault();

        var post = {
            img: $(e.target).find('[name=imageUrl]').val(),
            description: $(e.target).find('[name=description]').val(),
            thread:$(e.target).find('.thread.name').text(),
        };
        if(post.thread==="")
            alert("Please choose thread");
        else
        {
            Meteor.call('postInsert', post, function (error, result) {
                if (error)
                    return alert(error.reason);
                Router.go('postpage', {_id: result._id});
            })
        }
    },
    "click #threaddropdown li":function (e) {
        var threadName=$(e.target).text();
        $('.thread.name').html(threadName);
    }
});

Template.editprofile.events({
    "submit form": function (e) {
        e.preventDefault();

        var imgUrl = $(e.target).find('[name=imageUrl]').val();
        Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.image": imgUrl}});
    }
});

Template.userprofile.helpers(
    {
        equals: function (v1, v2) {
            return (v1 === v2);
        }
    }
);

Template.postedposts.helpers(
    {
        posts: function () {
            var userId = Template.parentData()._id;
            return Posts.find({userId: userId}, {sort: {submitted: -1}});
        }
    }
);

Template.likedposts.helpers(
    {
        posts: function () {
            var userId = Template.parentData()._id;
            return Posts.find({liked: userId}, {});
        }
    }
);

Template.navigationbar.onRendered(function () {
    $(".button-collapse").sideNav();
    $('.modal-trigger').leanModal();
    $('.dropdown-button').dropdown();
});

Template.post_card.rendered = function () {
    $('.tooltipped').tooltip();
};