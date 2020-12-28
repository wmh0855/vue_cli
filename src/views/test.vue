<template>
    <div class="about">
        <h1>This is an test page</h1>
        <button @click="showToast">显示toast</button>
        <button @click="showLoading">loading</button>
        <button v-copy="copyText">复制</button>
        <button v-debounce="debounceClick">防抖</button>
        <button v-longpress="longpress">长按</button>
        <input type="text" v-model="a" v-emoji />
        <!-- <img v-LazyLoad="xxx.jpg" /> -->
        <div class="el-dialog" v-draggable></div>
        <div
            v-waterMarker="{
                text: 'lzg版权所有',
                textColor: 'rgba(180, 180, 180, 0.4)',
            }"
        ></div>
        <div class="btns">
            <!-- 显示 -->
            <button v-permission="'1'">权限按钮1</button>
            <!-- 不显示 -->
            <button v-permission="'10'">权限按钮2</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            a: 123,
            copyText: "a copy directives",
        };
    },
    methods: {
        showToast() {
            this.$ltToast("你好");
        },
        showLoading() {
            this.$ltLoading({ isShow: true });
            setTimeout(() => {
                this.$ltLoading({ isShow: false });
            }, 1000);
        },
        debounceClick() {
            console.log("只触发一次");
        },
        longpress() {
            alert("长按指令生效");
        },
    },
    mounted() {
        console.log(this);
    },
};
</script>