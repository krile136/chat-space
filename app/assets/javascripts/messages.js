$(document).on('turbolinks:load', function () {
  function buildHTML(message) {
    var content = message.content ? `${message.content}` : "";
    var img = message.image ? `<img class="main__chat--image" src=${message.image}>` : "";
    var html = `<div class="main__chat--clear">
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

  function scrollBottom() {
    var target = $('.main__chat--finish-space').offset().top;
    $('html,body').animate({ scrollTop: target }, 300, 'swing');
  }

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
      $('.main__footer--input').val("");
      scrollBottom();
    })
    .fail(function () {
      alert('メッセージを入力してください');
    })
    .always(function (data) {
      $('.main__footer--send').prop('disabled', false);
    })
  })
})