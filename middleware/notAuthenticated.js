
// 已登录，页面不能访问 如登录和注册页面
export default function ({ store, redirect }) {
    // If the user is authenticated redirect to home page
    if (store.state.user) {
      return redirect('/')
    }
}
  