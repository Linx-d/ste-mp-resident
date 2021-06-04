<template>
    <view class="cu-avatar round lg" :style="userAvatar"></view>
</template>

<script>
import { DEFAULT_COVER, THUMBNAIL } from "@/common/const";
import Service from "@/apis/service";
export default {
    props: {
        user: { type: Object, default: () => {} },
    },
    computed: {
        userAvatar() {
            return this.userAvatarBg(this.user);
        },
    },
    methods: {
        userAvatarBg(user) {
            let url = DEFAULT_COVER;
            if (user) {
                if (user.avatar && user.avatar.indexOf("/") === 0) {
                    url = Service.URI_OSS + user.avatar + THUMBNAIL;
                } else if (user.wx && user.wx.avatarUrl) {
                    url = user.wx.avatarUrl;
                }
            }
            return `background-image:url(${url})`;
        },
    },
};
</script>

<style lang="scss" scoped>
</style>