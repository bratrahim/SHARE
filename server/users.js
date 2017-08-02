/**
 * Created by admin on 5/27/2017.
 */
Users = Meteor.users;
Users.allow({
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

Accounts.onCreateUser(function(options, user) {
    user.profile = options.profile ? options.profile : {};
    user.profile['image'] = "https://www.drupal.org/files/profile_default.png";
    user.username= options.username ? options.username :{};
    user.username=options.emails.address;
    return user
});