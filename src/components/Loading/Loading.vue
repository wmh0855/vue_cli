<script>
import loadImg from "../../assets/loading/loading.png";
export default {
  render(createElement) {
    return createElement(
      "transition",
      {
        attrs: {
          name: "fade"
        }
      },
      [
        createElement(
          "div",
          {
            class: "loading-box",
            attrs: {
              id: "custom-loading"
            },
            style: { display: this.isShow ? undefined : "none" }
          },
          [
            createElement(
              "div",
              {
                class: "big"
              },
              [
                createElement("img", {
                  attrs: {
                    src: loadImg
                  }
                }),
                createElement("span", "加载中...")
              ]
            )
          ]
        )
      ]
    );
  },
  props: {
    isShow: Boolean
  }
};
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  /* .fade-leave-active below version 2.1.8 */
  opacity: 0;
}

.loading-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  > div.big {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0.2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem 0.6rem 0.3rem 0.46rem;
    img {
      width: 0.6rem;
      margin-right: 0.4rem;
      animation: animate 3s linear infinite;
    }
    span {
      font-size: 0.36rem;
      color: #fff;
    }
  }
  > div.small {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    padding: 0.55rem 0.84rem 0.81rem 0.86rem;
    border-radius: 0.2rem;
    img {
      width: 1.17rem;
    }
  }
}
@keyframes animate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(720deg);
  }
}
</style>
