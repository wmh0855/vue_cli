<script>
export default {
  render(createElement) {
    return createElement(
      "div",
      {
        class: "toast-text",
        style: { display: this.theToast ? undefined : "none" }
      },
      [
        createElement(
          "div",
          {
            class: "toast-success"
          },
          [createElement("span", this.text)]
        )
      ]
    );
  },
  props: {
    text: String
  },
  data() {
    return {
      theToast: false
    };
  }
};
</script>
<style lang="scss">
.toast-text {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99999;
}

.toast-success {
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  z-index: 99999;
  span {
    max-width: 140px;
  }

  padding: 8px 12px;
  color: #fff;
}
</style>
