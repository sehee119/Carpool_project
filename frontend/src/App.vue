<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="white"
      flat
      src="@/public/car-image.jpg"
      height="100px"
    >
      <v-container class="py-0 fill-height">


        <v-btn
          v-for="link in links"
          :key="link"
          text
        >
          {{ link }}
        </v-btn>

        <v-spacer></v-spacer>


      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">

              <v-list
              rounded
              >

                <v-list-item
                  v-for="item in items1"
                  :key="item.title"
                  :to="item.to"
                  link
                >

                  <v-list-item-content>
                    <v-list-item-title>
                      {{item.title}}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-divider class="my-2"></v-divider>






            <v-list-group
            v-for="item in items2"
            :key="item.title"
            v-model="item.active"

            >


        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item

          v-for="child in item.items"
          :key="child.title"
          :to="child.to"
          link
        >


          <v-list-item-content>
            <v-list-item-title v-text="child.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      </v-list>



            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet
              min-height="70vh"
              rounded="lg"
            >
              <router-view></router-view>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>




<script>
  export default {
    data() {
      return {

      items1:[
        { title: 'Home', icon: 'mdi-view-dashboard', to: '/'}], // 메인 화면. 검색필터 있음

      items2: [
        {
          action: 'mdi-account', // 마이페이지, 아이콘
          active: false,
          items: [
            { title: 'Passenger', to: '/passenger' },
            { title: 'Driver', to: '/driver' },
            { title: 'Request', to: '/request' },
            { title: 'Chat', to: '/chat' },
            { title: 'Past', to: '/mypage' },

          ],
          title: 'Mypage'

        }

        ],
        links: [
        'Information',
        'Home',
        'Mypage'
      ],

      drawer:false,
     }
    },
  }
</script>
