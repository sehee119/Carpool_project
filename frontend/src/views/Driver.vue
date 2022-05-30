<template>
  <v-simple-table>
    <template 
    v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            출발지
          </th>

          <th class="text-left">
            목적지
          </th>

          <th class="text-left">
            시작일
          </th>

          <th class="text-left">
            종료일
          </th>

          <th class="text-left">
            카풀 요일
          </th>

          <th class="text-left">
            actions
          </th>

        </tr>
      </thead>

      <tbody>

          <tr
          v-for="driver in get_driver_list" 
          :key="driver.name"
        >
          <td v-if="driver.name==='김인하'">{{ driver.starting_point }}</td>
          <td v-if="driver.name==='김인하'">{{ driver.destination_point }}</td>
          <td v-if="driver.name==='김인하'">{{ driver.start_date.substring(0,10) }}</td>
          <td v-if="driver.name==='김인하'">{{ driver.end_date.substring(0,10) }}</td>
          <td v-if="driver.name==='김인하'">{{ driver.dotw.join(',') }}</td>
          
          
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



        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            

            <v-card-text>
              <v-container>
                  
                <v-row>
                   
                  
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.calories"
                      label="driver_passenger"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.fat"
                      label="driver_period"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.carbs"
                      label="driver_day"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.protein"
                      label="driver_start_point"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.protein"
                      label="driver_destination"
                    ></v-text-field>
                  </v-col>


                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.protein"
                      label="driver_start_time"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.protein"
                      label="driver_destination_time"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this carpool driver list?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
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
      dialogDelete: false,


      
      headers: [
        //{text: '동승자', align: 'start',sortable: false,value: 'id'}, // 운전자의 동승자
        { text: '시작일', value: 'start_date' },
       // { text: '카풀 요일', value: 'first_name' },
        { text: '출발지', value: 'starting_point' },
        { text: '도착지', value: 'destination_point' },
        //{ text: '출발 시간', value: 'start_time', sortable: false },
        //{ text: '도착 시간', value: 'destination_time', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.test();
      this.get_driver();
      
    },

    methods: {
        test(){
        axios
        .get("https://reqres.in/api/users?page=2")
        .then(res => {
          console.log(res);
          this.desserts=res.data.data
        })
        .catch(err => {
          console.log(err);
        });
        },
        

        get_driver(){
        axios
        .get("http://ec2-18-117-73-79.us-east-2.compute.amazonaws.com:3000/list")
        .then(res => {
          console.log(res.data);
          this.get_driver_list=res.data.data
        })
        .catch(err => {
          console.log(err);
        });

        },
      

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        axios
        .delete("https://reqres.in/api/users?page=2/id")
        .then(res => {
          console.log(res);
          console.log('delete 성공');
        })
        .catch(err => {
          console.log(err);
        }); 

        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {

        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
  
    },
  }
   // https://vuetifyjs.com/en/components/data-tables/#crud-actions
</script>

