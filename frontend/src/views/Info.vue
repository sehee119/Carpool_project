<template >
  <v-container class="pa-12 text-center">
    <v-row
      class="fill-height"
      align="center"
      justify="center"
    >
      <template v-for="(item, i) in items">
        <v-col
          :key="i"
          align="center" 
        >
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 12 : 2"
              :class="{ 'on-hover': hover }"
              max-width="700"
              :to="item.to"
                link
            >
              <v-img
                :src="item.img"
                height="225px"
              >
                <v-card-title class="text-h6 white--text">
                  <v-row
                    class="fill-height flex-column"
                    justify="space-between"
                  >
                    <p class="mt-4 subheading text-left">
                      {{ item.title }}
                    </p>

                    <div>
                      <p class="ma-0 text-body-1 font-weight-bold font-italic text-left">
                        {{ item.text }}
                      </p>
                      <p class="text-caption font-weight-medium font-italic text-left">
                        {{ item.subtext }}
                      </p>
                    </div>

                    <div class="align-self-center">
                      <v-btn
                        v-for="(icon, index) in icons"
                        :key="index"
                        :class="{ 'show-btns': hover }"
                        :color="transparent"
                        icon
                      >
                        <v-icon
                          :class="{ 'show-btns': hover }"
                          :color="transparent"
                        >
                          {{ icon }}
                        </v-icon>
                      </v-btn>
                    </div>
                  </v-row>
                </v-card-title>
              </v-img>
            </v-card>
          </v-hover>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      icons: ['mdi-check'],
      items: [
        {
          title: 'PASSENGER',
          text: '카풀 탑승자',
          subtext: '사용자가 탑승자로 등록되어 있는 카풀 목록들을 볼 수 있습니다',
          img: 'https://cdn.pixabay.com/photo/2016/11/22/23/44/porsche-1851246_960_720.jpg',
          to: '/passenger'
        },
        {
          title: 'DRIVER',
          text: '카풀 운전자',
          subtext: '사용자가 운전자로 등록되어 있는 카풀 목록들을 볼 수 있습니다',
          img: 'https://cdn.pixabay.com/photo/2021/09/25/10/08/road-6654573_960_720.jpg',
          to:'driver'
        },
        {
          title: 'REQUEST',
          text: '카풀 요청',
          subtext: '사용자가 카풀 요청한 목록들을 볼 수 있습니다',
          img: 'https://cdn.pixabay.com/photo/2013/11/15/13/57/road-210913_960_720.jpg',
          to:'/request'
        },
        {
          title: 'CHAT',
          text: '채팅',
          subtext: '사용자가 주고받은 채팅 내역을 볼 수 있습니다.',
          img: 'https://cdn.pixabay.com/photo/2020/07/08/10/17/car-5383371_960_720.jpg',
          to:'/chat'
        },
        {
          title: 'PAST',
          text: '과거 카풀 내역',
          subtext: '사용자가 지난 시간동안 이용한 카풀 내역을 볼 수 있습니다',
          img: 'https://cdn.pixabay.com/photo/2018/05/15/23/02/football-stadium-3404535_960_720.jpg',
          to: '/past'
        },
      ],
      transparent: 'rgba(255, 255, 255, 0)',
    }),
  }
</script>



<style scoped>
.v-card {
  transition: opacity .4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.6;
 }

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}
</style>