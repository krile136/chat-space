$(document).on('turbolinks:load', function () {
  // 新規コメントの組み立て
  function buildHTML(message) {
    var content = message.content ? `${message.content}` : "";
    var img = message.image ? `<img class="main__chat--image" src=${message.image}>` : "";
    var html = `<div class="main__chat--clear" data-message-id=${message.id} data-message-group-id=${message.group_id}>
                  <div class="main__chat--name">
                    ${message.user_name}
                  </div>
                  <div class="main__chat--date">
                    ${message.date}
                  </div>
                  <div class="main__chat--message">
                    ${content}
                  </div>
                  ${img}
                </div>`
    return html;
  }

  // 一番下までスクロール
  function scrollBottom() {
    var target = $('.main__chat--finish-space').offset().top;
    $('html,body').animate({ scrollTop: target }, 300, 'swing');
  }

  // sidebar内の最新コメントを更新
  function changeRoomContent(content, group_id) {
    var sidebar_last_message = content;
    var room_updated_message = "div[data-sidebar-message-group-id='" + group_id + "']"
    $(room_updated_message).text(sidebar_last_message);
  }

  // コメントが投稿された時の非同期通信
  $('#new_message').on('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function (data) {
      var html = buildHTML(data);
      $('.messages').append(html);
      $('#new_message')[0].reset();
      scrollBottom();
      changeRoomContent(data.content, data.group_id)
    })
    .fail(function () {
      alert('メッセージを入力してください');
    })
    .always(function (data) {
      $('.main__footer--send').prop('disabled', false);
    })
  })

  // 画面の自動更新
  var reloadMessages = function () {
    var group_id = $('.main__header--room-name').data("group-id");
    var last_message_id = $('.main__chat--clear').last().data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: { id: last_message_id }
    })
    .done(function (messages) {
      var insertHTML = "";
      if (messages.length !== 0) {
        var msg_group_id = messages[0].group_id;
        if (msg_group_id == group_id) {
          messages.forEach(function (message) {
            insertHTML = buildHTML(message);
            $('.messages').append(insertHTML);
          });
          scrollBottom();
        };
        var content = messages.slice(-1)[0].content;
        changeRoomContent(content, msg_group_id);
      };
    })
    .fail(function () {
      alert('自動更新に失敗しました');
    });
  }
  setInterval(reloadMessages, 5000);
})