<template> <!-- 검색필터 있는 페이지 -->


   
<v-container>
  
  <v-card 
  class="pa-4"
  ref="search_form">
<p align="center"> 카풀 검색 필터 </p>


<v-row>
    <v-col
    cols="12"
    sm="4">
      <v-text-field
        ref="search_start_point"
        v-model="search_start_point"
        append-icon="mdi-magnify"
        label="출발지*"
        
        required
        placeholder="입력하세요"
        single-line
        hide-details
      ></v-text-field>
    </v-col>

    <v-col
    cols="12"
    sm="4">
      <v-text-field
        ref="search_destination"
        v-model="search_destination"
        append-icon="mdi-magnify"
        label="목적지*"
        
        single-line
        hide-details
      ></v-text-field>
    </v-col>

    <v-col
    cols="12"
    sm="2">
    <v-select
            ref="search_gender"
            :items="['여자', '남자', '상관없음']"
            v-model="search_gender"
            label="성별*"
            required
          ></v-select>

    </v-col>

    <v-col
    cols="12"
    sm="3">
      <v-text-field
        ref="search_period"
        v-model="search_period"
        label="기간입력 (ex. 1개월 )*"

        single-line
        hide-details
      ></v-text-field>
    </v-col>

    <v-col
    cols="12"
    sm="3">
      <v-autocomplete
            :items="['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']"
            ref="search_day"
            v-model="search_day"
            label="카풀 요일 선택*"
            required
            multiple
          >
           </v-autocomplete>
    </v-col>

    <v-col
    cols="12"
    sm="3">
      <v-text-field
        ref="search_estimated_start_time"
        v-model="search_start_time"
        label="예상 탑승 시간 (ex.08:00)*"
        single-line
        hide-details
      ></v-text-field>
    </v-col>

    <v-col
    cols="12"
    sm="3">
      <v-text-field
        ref="search_destination_time"
        v-model="search_destination_time"
        label="예상 도착 시간 (ex. 08:50)*"
        single-line
        hide-details
      ></v-text-field>
    </v-col>
</v-row>

<v-row
  justify="center"
  align="center">
  
  <v-col
  cols="12"
  sm="4">
 
    <v-btn
       color="primary"
       @click="[search_info()]"
       >

      카풀 검색
      
      </v-btn>
  </v-col>
  <v-col
    cols="12"
    sm="4">

      <v-btn
       color="primary"
       @click="delete_info()"
       >

      초기화
      
      </v-btn>
<!--      <p> {{search_start_point}}</p>

     <div 
     v-for="item in carpool_list" :key="item.name">
     <div
     v-if="item.name===search_start_point">
      얘랑 같아요 {{item.name}} {{item.gender}} </div>
    
     {{ item.name }} 
     
     </div> -->


  </v-col>
</v-row>
    

</v-card>

<v-container>


<v-row 
  justify="center"
  align="center"> <!-- 카풀 등록 dialog, 운전자용 -->

<v-col
  cols="2"
  >

    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
    
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          
        >
         카풀 등록
        </v-btn>
    
      </template>
       <v-card ref="form">
        <v-card-text>
          <v-container>
            <v-row>

          <v-col
                cols="12"
                sm="6"
                md="4"
              >
          <v-text-field
            ref="input_name"
            v-model="input_name"
            :rules="[() => !!input_name || '이름을 입력하세요']"
            :error-messages="errorMessages"
            label="운전자 이름*"
            placeholder="ex) 김인하"
            required
          ></v-text-field>
          </v-col>


          <v-col
                cols="12"
                sm="6"
                md="4"
              >
          <v-select
            :items="['여자', '남자']"
            ref="input_gender"
            v-model="input_gender"
            :rules="[() => !!input_gender || '성별을 선택하세요']"
            label="성별*"
            required
          ></v-select>
          </v-col>



         <v-col
                cols="12"
                sm="6"
                md="4"
              >
          <v-select
            :items="['1', '2', '3', '4', '5', '6']"
            ref="input_seat"
            v-model="input_seat"
            :rules="[() => !!input_seat || '탑승 가능 인원을 선택하세요']"
            label="탑승 가능 인원*"
            required
          ></v-select>
         </v-col>




          <v-col
              sm="6">
          <v-text-field
            ref="input_period"
            v-model="input_period"
            :rules="[() => !!input_period || '카풀 기간을 입력하세요.']"
            label="카풀 기간 입력*"
            required
            placeholder="ex) 1개월"
          ></v-text-field>
          </v-col>




          <v-col
              sm="6">
           <v-autocomplete
            :items="['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']"
            ref="input_day"
            v-model="input_day"
            :rules="[() => !!input_day || '요일을 선택하세요']"
            label="카풀 요일 선택*"
            required
            multiple
          >
           </v-autocomplete>
          </v-col>





          <v-col 
              cols="12"
              sm="6"
              >
                <v-text-field
                  ref="input_start_point"
                  label="출발지*"
                  v-model="input_start_point"
                  :rules="[() => !!input_start_point || '출발지를 입력하세요.']"
                  required
                  placeholder="ex) 주안역"
                ></v-text-field>
              </v-col>







            <v-col 
              cols="12"
              sm="6">
                <v-text-field
                  ref="input_start_time"
                  label="출발시간*"
                  v-model="input_start_time"
                  :rules="[() => !!input_start_time || '출발시간을 입력하세요.']"
                  required
                  placeholder="ex) 8:00"
                ></v-text-field>
              </v-col>



              



              <v-col 
              cols="12"
              sm="6">
                <v-text-field
                  ref="input_destination"
                  label="목적지*"
                  v-model="input_destination"
                  :rules="[() => !!input_destination || '목적지를 입력하세요.']"
                  required
                  placeholder="ex) 인하대역"
                ></v-text-field>
              </v-col>




              <v-col 
              cols="12"
              sm="6">
                <v-text-field
                  ref="input_destination_time"
                  label="목적지 도착 시간*"
                  v-model="input_destination_time"
                  :rules="[() => !!input_destination_time || '목적지 도착 시간을 입력 하세요.']"
                  required
                  placeholder="ex) 8:50"
                ></v-text-field>
              </v-col>


              <v-col 
              cols="12"
              sm="6">
                <v-text-field
                  ref="input_car_number"
                  label="차량 번호*"
                  v-model="input_car_number"
                  :rules="[() => !!input_car_number || '차량번호를 입력 하세요.']"
                  required
                  placeholder="xx더 xxxx"
                ></v-text-field>
              </v-col>


              <v-col 
              cols="12"
              sm="6">
                <v-text-field
                  ref="input_car_type"
                  label="차 종류*"
                  v-model="input_car_type"
                  :rules="[() => !!input_car_type || '차종을 입력하세요.']"
                  required
                  placeholder="ex) 8:00"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>


        <v-divider class="mt-5"></v-divider>
        <v-card-actions>
          <v-btn 
          flat
          @click="dialog = false"
          text
          >Cancel
          </v-btn>

          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>

          <v-slide-x-reverse-transition>
            <v-tooltip
              v-if="formHasErrors"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  @click="resetForm"
                  v-on="on"
                  text
                >
                refresh
                </v-btn>
              </template>
              <span>내용 지우기</span>
            </v-tooltip>
          </v-slide-x-reverse-transition>

           <v-spacer></v-spacer>


          <v-btn color="primary" flat @click="[submit(),insertNew()]" text>Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-col>

</v-row>
</v-container>
     





<!-- 이름을 기준으로 데이터 정렬 -->


  <v-data-table
    v-if="search_button=='false'"

    
    max-width:200px
    :headers="headers"
    :items="carpool_list"
    :items-per-page="5"
    item-key="name"

  ></v-data-table> 




<!-- 검색 필터 나오는 table, column 총 12개 -->
 <v-simple-table>
    <template 
    v-slot:default
    v-if="search_button=='true'">
      <thead>
        <tr>
          <th class="text-left">
            이름
          </th>

          <th class="text-left">
            성별
          </th>

          <th class="text-left">
            남은자리
          </th>

          <th class="text-left">
            기간
          </th>

          <th class="text-left">
            요일
          </th>

          <th class="text-left">
            출발시간
          </th>

          <th class="text-left">
            출발지
          </th>

          <th class="text-left">
            도착지
          </th>

          <th class="text-left">
            탑승시간
          </th>

          <th class="text-left">
            도착시간
          </th>

          <th class="text-left">
            추가시간
          </th>

          <th class="text-left">
            거리차이
          </th>

          

        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in carpool_list" 
          :key="item.name"
        >
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination 
          && item.gender===search_gender"
          width="8%">{{ item.name }}</td>
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination 
          && search_gender==='상관없음'"
          width="8%">{{ item.name }}</td>

          <td v-if="item.start_point===search_start_point
          && item.destination===search_destination
          && item.gender===search_gender"
          width="7%">{{ item.gender }}</td>
          <td v-if="item.start_point===search_start_point
          && item.destination===search_destination
          && search_gender==='상관없음'"
          width="7%">{{ item.gender }}</td>

          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && item.gender===search_gender"
          width="9%">{{ item.seat }}</td>
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && search_gender==='상관없음'"
          width="9%">{{ item.seat }}</td>

          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && item.gender===search_gender"
          width="7%">{{ item.period }}</td>
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && search_gender==='상관없음'"
          width="7%">{{ item.period }}</td>


          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && item.gender===search_gender"
          width="8%">{{ item.day }}</td>
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && search_gender==='상관없음'"
          width="8%">{{ item.day }}</td>

          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && item.gender===search_gender"
          width="9%">{{ item.start_time }}</td>
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && search_gender==='상관없음'"
          width="9%">{{ item.start_time }}</td>

          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && item.gender===search_gender"
          width="8%">{{ item.start_point }}</td>
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && search_gender==='상관없음'"
          width="8%">{{ item.start_point }}</td>

          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && item.gender===search_gender"
          width="8%">{{ item.destination }}</td>
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && search_gender==='상관없음'"
          width="8%">{{ item.destination }}</td>

          
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && item.gender===search_gender"
          width="9%">{{ item.estimated_start_time }}</td>
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && search_gender==='상관없음'"
          width="9%">{{ item.estimated_start_time }}</td>

          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && item.gender===search_gender"
          width="9%">{{ item.destination_time}}</td>
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && search_gender==='상관없음'"
          width="9%">{{ item.destination_time}}</td>

          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && item.gender===search_gender"
          width="9%">{{ item.extra_time }}</td>
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && search_gender==='상관없음'"
          width="9%">{{ item.extra_time }}</td>

          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && item.gender===search_gender"
          width="9%">{{ item.extra_distance }}</td>
          <td v-if="item.start_point===search_start_point 
          && item.destination===search_destination
          && search_gender==='상관없음'"
          width="9%">{{ item.extra_distance }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-container>


</template>


<script>
export default {

   
    data(){
        return{

          

          // 카풀 search 할 때 필요한 데이터들
            search_button:'false',
            search_start_point:'',
            search_gender:'',
            search_periord:'',
            search_day:'',
            search_estimated_start_time:'',
            search_destination_time:'',
            


          // 카풀 등록할 때 필요한 데이터들
            dialog: false,

  

            errorMessages: '',

            input_name: null,
            input_gender: null,
            input_seat: null,
            input_period: null,
            input_day: null,
            input_start_point:null,
            input_start_time: null,
            input_destination:null,
            input_destination_time:null,
            input_car_number:null,
            input_car_type:null,

            formHasErrors: false,

            insert_error:false,


      


      
      




      carpool_list: [ // 테이블 기본 양식 그냥 넣음
        {
          name: '김민지',
          gender: '여자',
          seat : '1',
          period : '한달',
          day : '월요일',
          start_time : '8:00',
          start_point : '인천역',
          destination : '인하대',
          estimated_start_time : '8:30',
          destination_time : '8:50',
          extra_time : '5분',
          extra_distance : '0km'
        },

        {
          name: '이하늘',
          gender: '여자',
          seat : '1',
          period : '한달',
          day : '월요일',
          start_time : '7:00',
          start_point : '소래포구',
          destination : '서울역',
          estimated_start_time : '8:30',
          destination_time : '8:50',
          extra_time : '5분',
          extra_distance : '0km'
        },

        
        {
          name: '인비룡',
          gender: '여자',
          seat : '1',
          period : '한달',
          day : '월요일',
          start_time : '7:50',
          start_point : '소래포구',
          destination : '논현역',
          estimated_start_time : '8:30',
          destination_time : '8:50',
          extra_time : '5분',
          extra_distance : '0km'
        },

        {
          name: '정세모',
          gender: '남자',
          seat : '1',
          period : '두달',
          day : '월요일',
          start_time : '8:00',
          start_point : '논현역',
          destination : '소래포구',
          estimated_start_time : '8:30',
          destination_time : '8:50',
          extra_time : '5분',
          extra_distance : '1.1km (차 :7분, 도보: 17분)'
        },
      ],

      headers: [
        { text: '이름',align: 'center', sortable: false,value: 'name', width : 70},
        { text: '성별', align: 'center', sortable: false, value: 'gender',width : 60 },
        { text: '남은자리', align: 'center', sortable: false, value: 'seat',width : 75  },
        { text: '기간', align: 'center', sortable: false, value: 'period' ,width : 65 },

        { text: '요일', align: 'center', sortable: false, value: 'day' ,width : 70 },
        { text: '출발시간', align: 'center', value: 'start_time',width : 90  },
        { text: '출발지', align: 'center', sortable: false, value: 'start_point',width : 75  },
        { text: '도착지', align: 'center', sortable: false, value: 'destination',width : 75  },
        
        { text: '탑승시간', align: 'center', sortable: false, value: 'estimated_start_time',width : 75  },
        { text: '도착시간', align: 'center', sortable: false, value: 'destination_time',width : 75  },
        { text: '추가시간', align: 'center', sortable: false, value: 'extra_time' ,width : 75 },
        { text: '거리 차이', align: 'center', sortable: false, value: 'extra_distance' ,width : 75 },
      ],
    }
  },

  watch: {
      name () {
        this.errorMessages = ''
      }
    },

    computed: {
      form () { // 카풀 등록
        return {
          input_name: this.input_name,
          input_gender: this.input_gender,
          input_seat: this.input_seat,
          input_period: this.input_period,
          input_day: this.input_day,
          input_start_point: this.input_start_point,
          input_start_time: this.input_start_time,
          input_destination:this.input_destination,
          input_destination_time:this.input_destination_time,
          input_car_number:this.input_car_number,
          input_car_type:this.input_car_type
        }
      },

      search_form(){ // 카풀 검색
        return {
          search_start_point:this.search_start_point,
          search_destination:this.search_destination,
          search_gender:this.search_gender,
          search_period:this.search_period,
          search_day:this.search_day,
          search_estimated_start_time:this.estimated_start_time,
          search_destination_time:this.search_destination_time
          
        }
      } // 여기까지 computed , 카풀 reset 시키기 위해서 정의
    },

    watch: {
      name () {
        this.errorMessages = ''
      }
    },

    methods: {
      
      resetForm () { // submit 했을 때, validation 검사 error 가 나오면 다시 정보 입력할 수 있는 refresh 진행.
        this.errorMessages = []
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
          this.$refs[f].reset()
        })
      },

      submit () {
        this.formHasErrors = false
        this.insert_error = true

        Object.keys(this.form).forEach(f => { // 유효성 검사. vuetify 에서 양식 가져옴
          if (!this.form[f]) this.formHasErrors = true

          this.$refs[f].validate(true)
        })

       if(this.formHasErrors==false){ // 만약, input 값이 다 입력되어 있다면 
          this.dialog=false
          this.insert_error = false
        }

      },

      insertNew() { // 카풀 등록 함수

      if(this.insert_error==false){ // input 값이 다 입력되어 있어서 insert_error 가 false 이면, push 진행

      
    
        this.carpool_list.push({
        "name":this.input_name,
        "gender":this.input_gender, 
        "seat":this.input_seat,
        "period":this.input_period,
        "day":this.input_day,  
        "start_time":this.input_start_time,
        "start_point":this.input_start_point,
        "destination":this.input_destination, 
        "estimated_start_time":"", 
        "destination_time":this.input_destination_time, 
        "extra_time":"", 
        "extra_distance":"" })


        

        this.resetForm() // 값 push 후 자동으로 등록창 값 지운다.

      }
       },

       search_info() { // 카풀 검색 함수
        this.formHasErrors = false
        this.search_button='true'


        

         Object.keys(this.search_form).forEach(f => { // 유효성 검사. vuetify 에서 양식 가져옴
          if (!this.search_form[f]) this.formHasErrors = true

          this.$refs[f].validate(true)
        })
        

        
          	

         

         

         
         
         
       },

       delete_info() { // 카풀 초기화 함수. 내용도 다 reset 시킴
         this.search_button='false'

        this.errorMessages = []
        this.formHasErrors = false

        Object.keys(this.search_form).forEach(f => {
          this.$refs[f].reset()
        })
         
         
       },
    }
  }
</script>