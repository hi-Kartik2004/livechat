// // generate a random username
// var me = document.getElementById("username").value;
// console.log(me);
// // var me = user;
function perform() {
  var me = document.getElementById("username").value;
  console.log(me);

  $("#whoami").text(me);

  var $input = $("#chat-input");
  var $output = $("#chat-output");

  var pubnub = PUBNUB.init({
    publish_key: "demo",
    subscribe_key: "demo",
    uuid: me,
  });

  var channel = "memewarz-lobby-demo-5";

  $("#chat").submit(function () {
    pubnub.publish({
      channel: channel,
      message: {
        text: $input.val(),
        username: me,
      },
    });

    if ($input.val("")) return false;
  });

  pubnub.subscribe({
    channel: channel,
    message: function (data) {
      var $line = $(
        '<li class="list-group-item"><strong>' +
          data.username +
          ":</strong> </span>"
      );
      var $message = $('<span class="text" />').text(data.text).html();

      $line.append($message);
      $output.append($line);

      $output.scrollTop($output[0].scrollHeight);
    },
    presence: function (data) {
      console.log(data);

      // get notified when people join
      if (data.action == "join") {
        var $new_user = $(
          '<li id="' +
            data.uuid +
            '" class="list-group-item">' +
            data.uuid +
            "</li>"
        );

        $("#online-users").append($new_user);
      }

      // and when they leave
      if (data.action == "leave" || data.action == "timeout") {
        $("#" + data.uuid).remove();
      }
    },
  });
}
