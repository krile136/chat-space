require 'rails_helper'

describe MessagesController do
  # letメソッド使い必要なインスタンスを生成する
  # 今回のように複数のexampleで同一のインスタンスを使いたい場合に利用できる
  let(:group) { create(:group) }
  let(:user) { create(:user) }
  # letメソッドは呼び出された際に初めて実行荒れる遅延評価という
  # 特徴を持つ。後述のbeforeメソッドが各exampleの実行前に処理を行う
  # のに対して、letメソッドは初回の呼び出し時のみ実行される
  # テストの高速化、また一度実行された後は同じ値が返るのでテストに使う
  # オブジェクトの定義に適している

  describe '#index' do

    context 'log in' do
      # 各exampleが実行される前に実行される
      before do
        login user
        get :index, params: { group_id: group.id }
        # 擬似的にindexアクションを動かすリクエスト行うために、getメソッドを利用している
        # messagesのルーティングはgroupsにネストされているため、group_idを
        # 含んだパスを生成する。そのため。getメソッドの引数として
        # params以下を渡している。
      end

      # インスタンス変数にコントローラのassignsメソッド経由で参照できる
      # messageを参照したい場合、assigns(:message)と記述する
      it 'assigns @message' do
        expect(assigns(:message)).to be_a_new(Message)
        # @messageは、Message.newで定義された新しいMessageクラスのインスタンス。
        # be_a_newマッチャを利用することで対象が引数でしたクラスのインスタンス
        # かつ未保存のレコードであるかどうか確かめることができる。
      end

      it 'assigns @group' do
        expect(assigns(:group)).to eq group
        # eqマッチャを利用してassigns(:group)とgroupが同一であるかを確かめる
      end

      # 該当するビューが描画されているかテストする
      it 'renders index' do
        expect(response).to render_template :index
        # responseはexampleないでリクエストが行われた後の遷移後のビュー情報を持つインスタンス
        # render_templateマッチャは引数にアクション名をとり、引数で
        # 指定されたアクションがリクエストされた時に自動的に遷移するビューを返す。
      end
    end

    # ログインしていない時
    context 'not log in' do
      before do
        get :index, params: { group_id: group.id }
      end

      it 'redirects to new_user_session_path' do
        expect(response).to redirect_to(new_user_session_path)
        # redirect_toマッチャは引数のプレフィックスにリダイレクトした際の
        # 情報を返す。今回は非ログイン時にmessageコントローラのindexアクションを
        # 動かすリクエストが行われた際に、ログイン画面にリダイレクトするかどうかを
        # 確かめる記述になっている。
      end
    end
  end

  describe '#create' do
    let(:params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message) } }
    # attributes_for
    # createやbuild同様、FactoryGirlによって定義されるメソッドで、
    # オブジェクトを生成せずにハッシュを生成するという特徴を持つ

    # ログインしている場合
    context 'log in' do
      before do
        login user
      end

      # メッセージの保存に成功した場合
      context 'can save' do
        subject {
          post :create,
          params: params
        }
        # これは、「postメソッドでcreateアクションを擬似的に
        # リクエストした結果」という意味になる

        it 'count up message' do
          expect{ subject }.to change(Message, :count).by(1)
          # createアクションのテストを行う際にはchangeマッチャーを利用する
          # changeマッチャは引数が変化したかどうかを確かめられる
          # change(Message, :count).by(1)と記述することでMessageモデルの
          # レコードの総数が一つ増えたかどうかを確認できる。
          # 保存に成功している場合、レコードが必ず一つ増えているはず
        end

        it 'redirects to group_messages_path' do
          subject
          expect(response).to redirect_to(group_messages_path(group))
        end
      end

      # メッセージの保存に失敗した場合
      context 'can not save' do
        let(:invalid_params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message, content: nil, image: nil) } }
        # 擬似的にcreateアクションをリクエストする際に、invalid_paramsを引数として
        # 渡してあげることによって意図的にメッセージの保存に失敗する場合を再現できる

        subject {
          post :create,
          params: invalid_params
        }

        # Rspecで〜であることを期待する場合にはtoを使用するが、〜でないことを期待するときは
        # not_toを利用する
        it 'does not count up' do
          expect{ subject }.not_to change(Message, :count)
          # Messageモデルのレコード数が変化しないこと≒保存に失敗したこと
        end

        it 'renders index' do
          subject
          expect(response).to render_template :index
        end
      end
    end

    # ログインしていない場合
    context 'not log in' do
      it 'redirects to new_user_session_path' do
        post :create, params: params
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end