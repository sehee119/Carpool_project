<template> <!-- 검색필터 있는 페이지 -->


   
<v-container>
  
  <v-card 
  class="pa-4"
  ref="search_form">
<h2 align="center"> 카풀 검색 필터 </h2>
<!-- <p> -- search 테스트 예시입니다 -- </p>
<p>시작일 : {{search_dates[0]}}</p>
<p>종료일 : {{search_dates[1]}}</p>
<p>출발지 :{{search_starting_point}}</p>
<p>도착지 :{{search_destination_point}}</p>
<p>요일 :{{search_dotw}}</p>
<p>성별 :{{search_gender}}</p>
<p>도착시간 :{{search_destination_time}}</p>
<p>버튼값 :{{search_button}}</p>
    <v-btn @click="count_var">테스트</v-btn>  -->

<v-spacer></v-spacer>


<v-row>
    <v-col
    cols="12"
    sm="4">
      <v-text-field
        ref="search_starting_point"
        v-model="search_starting_point"
        append-icon="mdi-magnify"
        label="출발지*"

        :rules="[() => !!search_starting_point || '출발지를 입력하세요']"
        :error-messages="errorMessages"
        
        required
      ></v-text-field>
    </v-col>

    <v-col
    cols="12"
    sm="4">
      <v-text-field
        ref="search_destination_point"
        v-model="search_destination_point"
        append-icon="mdi-magnify"
        label="목적지*"

        :rules="[() => !!search_destination_point || '목적지를 입력하세요']"
        
      ></v-text-field>
    </v-col>

    <v-col
    cols="12"
    sm="4">
    <v-select
            ref="search_gender"
            :items="['Male', 'Female', '상관없음']"
            v-model="search_gender"

            :rules="[() => !!search_gender || '성별을 선택 하세요']"

            label="성별*"
            required
          ></v-select>

    </v-col>



<v-col
      cols="12"
      sm="6"
    >
<h3> 카풀 기간 </h3>
    </v-col>


    <v-col
      cols="12"
      sm="6"
    >
<h3> 도착 시간 : {{ search_destination_time}} (24H)</h3>
    </v-col>


    <v-col
      cols="12"
      sm="6"
    >
      <v-date-picker
        v-model="search_dates"
        range
      ></v-date-picker>
    </v-col>



        <v-col
      cols="12"
      sm="6"
    >

    <v-time-picker
      v-model="search_destination_time"
       label="도착시간"
      :landscape="$vuetify.breakpoint.smAndUp"
      ampm-in-title
    ></v-time-picker>
  </v-col>


      <v-col
      cols="12"
      sm="6"
    >
      <v-text-field
        v-model="dateRangeText"
        label="시작일 ~ 종료일 "
        prepend-icon="mdi-calendar"
        readonly
      ></v-text-field>
    </v-col>



          <v-col
              sm="6">
           <v-autocomplete
            :items="['월', '화', '수', '목', '금', '토', '일']"
            ref="search_dotw"
            v-model="search_dotw"
            :rules="[() => !!search_dotw || '요일을 선택하세요']"
            label="카풀 요일 선택*"
            required
            multiple
          >
           </v-autocomplete>
          </v-col>






</v-row>

<v-row>
  <v-spacer></v-spacer>
  
  <v-col
  cols="12"
  sm="4">
 <!-- search_info -->
    <v-btn
       color="primary"
       @click="[count_true(),search_data_post(),search_info()]"
       >

      카풀 검색
      
      </v-btn>
  </v-col>
  <v-spacer></v-spacer>
  <v-col
    cols="12"
    sm="4">

      <v-btn
       color="primary"
       @click="[count_false(),delete_info()]"
       >

      초기화
      
      </v-btn>
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
              >
          <v-select
            :items="['1', '2', '3', '4', '5', '6']"
            ref="input_max_passenger"
            v-model="input_max_passenger"
            :rules="[() => !!input_max_passenger || '탑승 가능 인원을 선택하세요']"
            label="탑승 가능 인원*"
            required
          ></v-select>
         </v-col>

          <v-col
            cols="12"
            sm="6">
            <v-date-picker
               v-model="input_dates"
               range
            ></v-date-picker>
          </v-col>

                <v-col
      cols="12"
      sm="6"
    >
      <v-text-field
        v-model="dateRangeText_input"
        label="시작일 ~ 종료일 "
        prepend-icon="mdi-calendar"
        readonly
      ></v-text-field>
    </v-col>







         



          <v-col
              sm="6">
           <v-autocomplete
            :items="['월', '화', '수', '목', '금', '토', '일']"
            ref="input_dotw"
            v-model="input_dotw"
            :rules="[() => !!input_dotw || '요일을 선택하세요']"
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
                  ref="input_starting_point"
                  label="출발지*"
                  v-model="input_starting_point"
                  :rules="[() => !!input_starting_point || '출발지를 입력하세요.']"
                  required
                  placeholder="ex) 주안역"
                ></v-text-field>
              </v-col>





              



              <v-col 
              cols="12"
              sm="6">
                <v-text-field
                  ref="input_destination_point"
                  label="목적지*"
                  v-model="input_destination_point"
                  :rules="[() => !!input_destination_point || '목적지를 입력하세요.']"
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
                  placeholder="ex) 8:50 or 13:20"
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
                  v-model="input_car_type"
                  
                  :rules="[() => !!input_car_type || '차종을 입력하세요.']"
                  
                  label="차 종류*"
                  required
                  placeholder="ex) 코나"
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


          <v-btn color="primary" flat @click="[submit() , insertNew()]" text>Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-col>

</v-row>
</v-container>
     


<!-- 검색 하기 전, 메인 페이지 카풀 목록 -->
<v-simple-table>
    <template 
    v-slot:default
    v-if="search_button=='false'">
      <thead>
        <tr>
          
          <th class="text-center" align="center">
            이름
          </th>

          <th class="text-center" align="center">
            성별
          </th>

          <th class="text-center" align="center">
            남은자리
          </th>

          <th class="text-center" align="center">
            시작일
          </th>

          <th class="text-center" align="center">
            종료일
          </th>

          <th class="text-center" align="center">
            요일
          </th>

          <th class="text-center" align="center">
            도착시간
          </th>

          <th class="text-center" align="center">
            출발지
          </th>

          <th class="text-center" align="center">
            도착지
          </th>


          

        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in get_list" 
          :key="item.name"
        >
          <td width="9%" align="center">{{ item.name }}</td>
          <td width="7%" align="center">{{ item.gender }}</td>
          <td width="7%" align="center">{{ item.max_passenger }}</td>
          <td width="8%" align="center">{{ item.start_date.substring(0,10) }}</td>
          <td width="8%" align="center">{{ item.end_date.substring(0,10) }}</td>
          <td width="8%" align="center">{{ item.dotw.join(',') }}</td>
          <td width="8%" align="center"> 검색 필요</td>
          <td width="9%" align="center">{{ item.starting_point }}</td>
          <td width="9%" align="center">{{ item.destination_point }}</td>


        </tr>
      </tbody>
    </template>
  </v-simple-table>

<!-- 검색 필터 나오는 table, column 총 12개 -->
 <v-simple-table>
    <template 
    v-slot:default
    v-if="search_button=='true'">
      <thead>
        <tr>
          <th class="text-left" width="9%">
            이름
          </th>

          <th class="text-left">
            성별
          </th>

          <th class="text-left">
            남은자리
          </th>

          <th class="text-left">
            시작일
          </th>

          <th class="text-left">
            종료일
          </th>

          <th class="text-left">
            요일
          </th>

          <th class="text-left">
            출발지
          </th>

          <th class="text-left">
            도착지
          </th>

          <th class="text-left">
            도착시간
          </th>

          <th class="text-left">
            탑승시간
          </th>

          <th class="text-left">
            추가시간
          </th>

          <th class="text-left">
            거리차이
          </th>

           <th class="text-left">

          </th>

          

        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item2 in get_search_list" 
          :key="item2.name"
        >

          <td width="7%">{{ item2.name }}</td>
          <td width="7%">{{ item2.gender }}</td>
          <td width="7%">{{ item2.max_passenger }}</td>
          <td width="7%">{{ item2.start_date }}</td>
          <td width="7%">{{ item2.end_date }}</td>
          <td width="9%">{{ item2.dotw.join(',') }}</td>
          <td width="9%">{{ item2.starting_point }}</td>
          <td width="9%">{{ item2.destination_point }}</td>
          <td width="9%">{{ item2.desired_arrival_time }}</td>
          <td width="9%">{{ item2.ride_time}}</td>
          <td width="9%">{{ item2.time_difference}}</td>
          <td width="9%">{{ item2.distance_difference}}</td>


<td width="7%">
  <template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog2"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          신청
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">카풀 신청</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text class="h3"> (탑승자)출발지 : {{search_starting_point}}</v-text>
              </v-col>

              <v-col
                cols="12"
              >
                <v-text> 카풀 시작일 : {{search_dates[0]}}</v-text>
              </v-col>

              <v-col
                cols="12"
              >
                <v-text> 카풀 종료일 : {{search_dates[1]}}</v-text>
              </v-col>


              <v-col cols="12">
                <v-text> 카풀 요일 : {{search_dotw.join(',')}}</v-text>
              </v-col>


              <v-col cols="12">
                <v-text-field
                  v-model="candidate_desired_time"
                  label="탑승 희망 시간 ( 직접 입력. ex: 08:45 )"
                  required
                ></v-text-field>
              </v-col>
             
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog2 = false"
          >
            취소
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="[candidate(), dialog2=false]"
          >
            신청
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </template>
</td>

          <!-- <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point 
          && item.gender===search_gender"
          width="9%">{{ item.name }}</td>
          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point 
          && search_gender==='상관없음'"
          width="9%">{{ item.name }}</td>

          <td v-if="item.starting_point===search_starting_point
          && item.destination_point===search_destination_point
          && item.gender===search_gender"
          width="7%">{{ item.gender }}</td>
          <td v-if="item.starting_point===search_starting_point
          && item.destination_point===search_destination_point
          && search_gender==='상관없음'"
          width="7%">{{ item.gender }}</td>

          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && item.gender===search_gender"
          width="7%">{{ item.max_passenger }}</td>
          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && search_gender==='상관없음'"
          width="7%">{{ item.max_passenger }}</td>

          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && item.gender===search_gender"
          width="8%">{{ item.start_date.substring(0,10) }}</td>
          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && search_gender==='상관없음'"
          width="8%">{{ item.start_date.substring(0,10) }}</td>


          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && item.gender===search_gender"
          width="8%">{{ item.end_date.substring(0,10) }}</td>
          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && search_gender==='상관없음'"
          width="8%">{{ item.end_date.substring(0,10) }}</td>


          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && item.gender===search_gender"
          width="8%">{{ item.dotw.join(',') }}</td>
          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && search_gender==='상관없음'"
          width="8%">{{ item.dotw.join(',') }}</td>

          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && item.gender===search_gender"
          width="7%">{{ item.desired_arrival_time }}</td>
          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && search_gender==='상관없음'"
          width="7%">{{ item.desired_arrival_time }}</td>  도착 시간 

          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && item.gender===search_gender"
          width="9%">{{ item.starting_point }}</td>
          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && search_gender==='상관없음'"
          width="9%">{{ item.starting_point }}</td>

          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && item.gender===search_gender"
          width="9%">{{ item.destination_point }}</td>
          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && search_gender==='상관없음'"
          width="9%">{{ item.destination_point }}</td>

          
          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && item.gender===search_gender"
          width="7%">{{ item.estimated_start_time }}</td>
          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && search_gender==='상관없음'"
          width="7%">{{ item.estimated_start_time }}</td>

          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && item.gender===search_gender"
          width="7%">{{ item.extra_time }}</td>
          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && search_gender==='상관없음'"
          width="7%">{{ item.extra_time }}</td>

          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && item.gender===search_gender"
          width="7%">{{ item.extra_distance }}</td>
          <td v-if="item.starting_point===search_starting_point 
          && item.destination_point===search_destination_point
          && search_gender==='상관없음'"
          width="7%">{{ item.extra_distance }}</td> -->
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-container>


</template>


<script>
import axios from "axios"

export default {

   
    data(){
        return{

          test_name:'hi',
          errors:[],

          
          

          // 카풀 search 할 때 필요한 데이터들
            search_button:'false',
            search_starting_point:'', // 카풀 검색
            search_destination_point:'',
            search_gender:'',
            search_dotw:'',
            search_dates: ['2022-05-24', '2022-05-31'], // [0]:시작일 [1]:종료일
            
            search_estimated_start_time:'',
            search_destination_time:'', // 카풀 시간 받는 변수. 24h.

            search_formHasErrors: false,
            



            dialog: false, // 카풀 등록할 dialog
            dialog2: false,  // 신청 dialog 

  

            errorMessages: '',

            input_name: null, // 카풀 등록
            input_max_passenger: null,
            input_dates: ['2022-06-01', '2022-06-08'],

            input_dotw: null,
            input_starting_point:null,
            input_destination_point:null,
            input_destination_time:null,

            input_car_number:null,
            input_car_type:null,

            formHasErrors: false,
            insert_error:false,


            candidate_desired_time : null, // 카풀 신청. 탑승 희망 시간


      


      
      

      get_list: [], // 데이터 받는 리스트
      get_search_list:[],

    }
  },

  watch: {
      name () {
        this.errorMessages = ''
      }
    },

    created () {
      this.get_data();
      
    },

    

    computed: {
      dateRangeText () {
        return this.search_dates.join(' ~ ')
      },

      dateRangeText_input () {
        return this.input_dates.join(' ~ ')
      },

      form() { // 카풀 등록 데이터
        return {
          input_name: this.input_name,
          input_max_passenger: this.input_max_passenger, 
          input_dotw: this.input_dotw, // 요일
          input_starting_point: this.input_starting_point, 

          input_destination_point:this.input_destination_point,
          input_destination_time:this.input_destination_time,
          input_car_number:this.input_car_number,
          input_car_type:this.input_car_type
        }
      },

      search_form(){ // 카풀 검색 데이터 초기화
        return {
          search_starting_point:this.search_starting_point,
          search_destination_point:this.search_destination_point,
          search_gender:this.search_gender,
          search_dotw:this.search_dotw,

          search_estimated_start_time:this.estimated_start_time,
          search_destination_time:this.search_destination_time
          
        }
      } // 여기까지 computed , 카풀 reset 시키기 위해서 정의
    },



    methods: {

      gender_test(){
        if(this.search_gender === "상관없음"){
          this.search_gender =["male","Female"]
        }

      },

      get_data(){ // 데이터 처음부터 가져와줌.
        axios
        .get("http://ec2-18-117-73-79.us-east-2.compute.amazonaws.com:3000/list")
        .then(res => {
          console.log(res.data)
          this.get_list=res.data.data
          console.log("get_data 함수입니다. 데이터를 서버에서 가져옵니다")
          
        })
        .catch(err => {
          console.log(err)
        })
        .then(()=>{

        })
      },

      
      resetForm () { // submit 했을 때, validation 검사 error 가 나오면 다시 정보 입력할 수 있는 refresh 진행.
        this.errorMessages = []
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
          this.$refs[f].reset()
        })
      },

      submit () { // 카풀 등록할 때 유효성 검사 하는 함수
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

        console.log("submit 실행")

      },

      insertNew() {     // 카풀 등록 함수
      axios
        .post("http://ec2-18-117-73-79.us-east-2.compute.amazonaws.com:3000/register", 
        {client_id: 1, // 사용자id (DB id랑 동일)
        max_passenger: this.input_max_passenger, // 최대 탑승자 수
        start_date: this.input_dates[0], // 시작일
        end_date: this.input_dates[1], // 종료일
        dotw: this.input_dotw, // 요일
        start_name: this.input_starting_point, // 출발지(운전자)
        goal_name: this.input_destination_point, // 도착지(운전자)
        arrival_time : this.input_destination_time, // 도착 희망시간(운전자)
        car_num : this.input_car_number, // 차량번호
        car_category : this.input_car_type, // 차종

        })
       .then(res => {
          console.log(res)
          console.log("insertNew 함수입니다. 카풀 등록 진행합니다")
          this.resetForm() // 값 등록 성공후 자동으로 등록창 값 지운다.
        })
        .catch(err => {
          console.log(err)
          console.log("insertNew 함수입니다. 카풀 등록 실패")
        })
        .then(()=>{

        })

      // if(this.insert_error==false){ // input 값이 다 입력되어 있어서 insert_error 가 false 이면, push 진행
      //   this.list_test.push({
      //   "name":this.input_name,
      //   "gender":this.input_gender, 
      //   "max_passenger":this.input_max_passenger,
      //   "start_date":this.input_dates[0],
      //   "end_date":this.input_dates[1],
      //   "dotw":this.input_dotw,  
      //   // "start_time":this.input_start_time,
      //   "starting_point":this.input_starting_point,
      //   "destination_point":this.input_destination_point, 
      //   // "estimated_start_time":"", 
      //   // "destination_time":this.input_destination_time, 
      //   // "extra_time":"", 
      //   // "extra_distance":"" })
      //   })
      // }






      
       },


        search_data_post(){
        if(this.search_gender === "상관없음"){ // gender 가 상관 없음이면
            

         axios.get( "http://ec2-18-117-73-79.us-east-2.compute.amazonaws.com:3000/filter",
        {params:{
        start_date:this.search_dates[0],
        end_date:this.search_dates[1],
        start_name:this.search_starting_point,
        goal_name:this.search_destination_point,
        //"desired_arrival_time":this.search_destination_time,
        gender:['Male', 'Female'],
        dotw:this.search_dotw,
        }})
        .then(res => {
          console.log(res.data)
          this.get_search_list=res.data.data
          console.log("search_data_post 함수입니다. 검색 값을 서버에 보내고 요청 데이터를 받아옵니다. gender 상관없음")
          
        })
        .catch(err => {
          console.log(err)
          console.log('search_data_post 안옴;')
        })
        .then(()=>{

        })
        } else { // gender 가 Male 또는 Female 이면
         axios.get( "http://ec2-18-117-73-79.us-east-2.compute.amazonaws.com:3000/filter",
        {params:{
        start_date:this.search_dates[0],
        end_date:this.search_dates[1],
        start_name:this.search_starting_point,
        goal_name:this.search_destination_point,
        //"desired_arrival_time":this.search_destination_time,
        gender:this.search_gender,
        dotw:this.search_dotw,
        }})
        .then(res => {
          console.log(res.data)
          this.get_search_list=res.data.data
          console.log("search_data_post 함수입니다. 검색 값을 서버에 보내고 요청 데이터를 받아옵니다. gender 특정 값")
          
        })
        .catch(err => {
          console.log(err)
          console.log('search_data_post 안옴;')
        })
        .then(()=>{

        })
        }


       },

       candidate(){
        axios
        .post( 'http://ec2-18-117-73-79.us-east-2.compute.amazonaws.com:3000/candidate',
        {user_id:1, // 김인하로 진행
        carpool_id : 1,
        start_name:this.search_starting_point, // 출발지(탑승자)
        start_date:this.search_dates[0], // 시작일
        end_date:this.search_dates[1], // 종료일
        dotw:this.search_dotw, // 요일
        desired_time:this.candidate_desired_time, // 탑승 희망 시간
        },
        )
        .then(res => {
          console.log(res)
          console.log("candidate 함수입니다. 카풀 신청을 진행합니다.")
          
        })
        .catch(err => {
          console.log(err)
          console.log('candidate 함수 안옴;')
        })
        .then(()=>{

        })


       },





       search_info() { // 카풀 검색 함수
        this.formHasErrors = false

        //this.search_button ='true'
        
        


        

         Object.keys(this.search_form).forEach(f => { // 유효성 검사. vuetify 에서 양식 가져옴
          if (!this.search_form[f]) this.search_formHasErrors = true

          this.$refs[f].validate(true)
        })

        if(this.search_formHasErrors == false){
          //this.search_button ='true'
        }


      

       },




       delete_info() { // 카풀 초기화 함수. 내용도 다 reset 시킴
        this.search_button='false'
        this.errorMessages = []
        this.search_formHasErrors = false

        Object.keys(this.search_form).forEach(f => {
          this.$refs[f].reset()
          this.search_button='false'
        })


         
         
       },

       count_true(){ // true 로 만들어서 검색 필터만 보이게
         if(this.search_button==='false'){
           this.search_button='true'
         }
       },

        count_false(){ // 메인 목록 리스트 보이게
         if(this.search_button=='true'){
           this.search_button='false'
         }
       },
    }
  }
</script>