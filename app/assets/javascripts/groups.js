$(document).on('turbolinks:load', function () {
  $(function () {

    var user_list = $("#user-search-result");
    var member_list = $("#member_search_result");

    function appendUser(user) {
      var html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${ user.name}</p>
                  <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id=${ user.id} data-user-name=${user.name}>追加</div>
                </div>`
      user_list.append(html);
    }

    function appendErrMsgToHTML(msg) {
      var html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${ msg}</p>
                </div>`
      user_list.append(html);
    }

    function appendMembers(user_name, user_id) {
      var html = `<div class='chat-group-user clearfix js-chat-member' id="${user_id}">
                  <input name="group[user_ids][]" type="hidden" value="${user_id}" id="group_user_ids">
                  <p class='chat-group-user__name'>${user_name}</p>
                  <a class='user_search_remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</a>
                </div>`
      member_list.append(html);
    }


    $("#user-search-field").on("keyup", function () {
      var input = $("#user-search-field").val();
      console.log(input);
      $.ajax({
        type: 'GET',
        url: '/users',
        data: { keyword: input },
        dataType: 'json'
      })

        .done(function (users) {
          $("#user-search-result").empty();
          var current_id = $(".current_id").attr('id');
          if (users.length != 0) {
            users.forEach(function (user) {
              if (user.id != current_id) {
                appendUser(user); 
              }
            });
          }
          else {
            appendErrMsgToHTML("一致するメンバーはいません")
          }
        })
        .fail(function () {
          alert("ユーザー検索に失敗しました");
        })
    });

    $(document).on("click", ".user-search-add", function () {
      var user_id = $(this).data("user-id");
      var user_name = $(this).data("user-name");
      $(this).parent().remove();
      appendMembers(user_name, user_id);
    });
    $(document).on("click", '.user_search_remove', function () {
      $(this).parent().remove();
    });
  });
});
