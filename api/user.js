import { request } from "@/plugins/request";

// 用户登录
export const login = data => {
    return request({
        method: "POST",
        url: "/api/users/login",
        data
    })
}

export const register = data => {
    return request({
        method: "POST",
        url: "/api/users",
        data
    })
}

export const updateUser = data => {
    return request({
        method: "PUT",
        url: "/api/user",
        data
    })
}

// 关注作者
export const follow = username => {
    request({
        method: 'POST',
        url: `/api/profiles/${username}/follow`,
    })
}
  

// 取关作者
export const unfollow = username => {
    request({
        method: 'DELETE',
        url: `/api/profiles/${username}/follow`,
    })
}

// 获取用户信息
export const getProfile = (username) =>
  request({
    method: 'GET',
    url: `/api/profiles/${username}`,
})
  