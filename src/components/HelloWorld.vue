<template>
  <div class="hello">
    <canvas id="c" width="800px" height="800px"></canvas>
    <button @click="submit">Submit</button>
  </div>
</template>

<script>
const f = require("fabric");
import Rectangle from "./Rectangle";
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      myRect: {}
    };
  },
  mounted() {
    let canvas = new f.fabric.Canvas("c");
    let rect = new Rectangle(canvas, f);
    rect.on("done", data => {
      this.myRect[data.name] = data;
    });

    rect.on("remove", rectName => {
      console.log("REMOVE ", rectName)
      delete this.myRect[rectName]
    });

    let imageSrc =
      "https://www.mydomaine.com/thmb/hFSx4r6ymYnrZWa-AFYnAnfMeKs=/700x700/smart/filters:no_upscale()/cdn.cliqueinc.com__cache__posts__273792__best-interior-design-accounts-on-instagram-273792-1543527624304-image.700x0c-82b6a3b247eb4d2a97862280e74992b3.jpg";
    let image = f.fabric.Image.fromURL(imageSrc, img => {
      img.selectable = false;
      canvas.setWidth(img.width);
      canvas.setHeight(img.height);
      canvas.add(img);
    });
  },
  methods: {
    submit() {
      console.log(this.myRect);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
canvas {
  border: 1px solid lightgreen;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
