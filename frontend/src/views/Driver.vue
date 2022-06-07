<template>


  <v-simple-table>
    <template 
    v-slot:default>

    
      <thead>
        <tr>

          <th class="text-center">
            no
          </th>
          <th class="text-center">
            출발지
          </th>

          <th class="text-center">
            목적지
          </th>

          <th class="text-center">
            시작일
          </th>

          <th class="text-center">
            종료일
          </th>

          <th class="text-center">
            카풀 요일
          </th>

          <th class="text-center">
            actions
          </th>

        </tr>
      </thead>


      <tbody>

          <tr
          v-for="driver in get_driver_list" 
          :key="driver.name"
        >
          <td v-if="driver.name==='김인하'" class="text-center">{{ driver.carpool_id }}</td> 
          <td v-if="driver.name==='김인하'" class="text-center">{{ driver.starting_point }}</td>
          <td v-if="driver.name==='김인하'" class="text-center">{{ driver.destination_point }}</td>
          <td v-if="driver.name==='김인하'" class="text-center">{{ driver.start_date.substring(0,10) }}</td>
          <td v-if="driver.name==='김인하'" class="text-center">{{ driver.end_date.substring(0,10) }}</td>
          <td v-if="driver.name==='김인하'" class="text-center">{{ driver.dotw.join(',') }}</td> 
          <td v-if="driver.name==='김인하'" class="text-center"> 

          <v-btn
            color="primary"
            text
            @click="delete_driver(driver.carpool_id)"
          >
            삭제하기
          </v-btn>

      
    </td> 
  </tr>
          
          
      </tbody>
      
      
    </template>
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>김인하님이 운전자 등록된 카풀 리스트</v-toolbar-title>

        
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>


            

  
  </v-simple-table>



</template>





<script>
import axios from "axios"


  export default {
    
      
    data: () => ({

      users: null,
      test2_data: null,

      get_driver_list: [],

      dialog: false,


     
    }),



    

    created () {
      this.test();
      this.get_driver();
      
    },

    methods: {
        test(){
        axios
        .get("https://dummyjson.com/products")
        .then(res => {
          console.log(res.data);
          this.test2_data=res.data.data
        })
        .catch(err => {
          console.log(err);
        });
        },

        test2(carpool_id){
        console.log(carpool_id)
        },
        

        get_driver(){
        axios
        .get("http://ec2-18-117-73-79.us-east-2.compute.amazonaws.com:3000/list")
        .then(res => {
          console.log(res.data);
          console.log("get_driver() 함수입니다");
          this.get_driver_list=res.data.data  
          
        })
        .catch(err => {
          console.log(err);
        });

        },
      

     

      delete_driver(carpool_id) {
        axios
        .delete("http://ec2-18-117-73-79.us-east-2.compute.amazonaws.com:3000/list/"+carpool_id)
        .then(res => {
          console.log(res.data);
          console.log("id : " + carpool_id + " delete 성공");
          this.get_driver();
        })
        .catch(err => {
          console.log(err);
          console.log("id : " + carpool_id + " delete 실패");
        }); 

        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

     
    },
  }
   // https://vuetifyjs.com/en/components/data-tables/#crud-actions
</script>

