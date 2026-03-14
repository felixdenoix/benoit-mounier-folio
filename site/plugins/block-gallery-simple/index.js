panel.plugin("felix-denoix/gallery-simple-block", {
  blocks: {
    "gallery-simple": {
      template: `
        <div>
          <img
            v-for="(media, key) in content.medias"
            :key="key"
            :src="media.url"
            style="margin-bottom:10px"/>
        </div>
      `,
    },
    "gallery-title": {
      computed: {
        formatted: () => {
          console.log(this);
          return this.content.title + " " + this.content.subtitle;
        },
      },
      template: `
        <div>
         <span style="font-weight:bold;font-size:1.2rem;margin-bottom:10px">{{content.title}}</span> </br>
         <span style="font-weight:normal;font-size:1rem;">{{content.subtitle}}</span>
        </div>
      `,
    },
  },
});
