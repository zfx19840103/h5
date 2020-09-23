<template>
  <div class="areaContent">
    <div class="searchBox">
      <div class="inpBox">
        <!-- <div class="icondiv">111</div> -->
        <i class="el-icon-search icondiv"></i>
        <input class="seartxt" @input="inputChange" v-model="searchInp" type="text" placeholder="搜索">
      </div>
      <div class="cancel" @click="cancalFun">取消</div>
    </div>
    <div class="areaBox">
      <div v-for="item in areaData" @click="areaselecr(item)" :class="item.stock == 0? 'noneStock' : 'areaItem'">
        <span>{{ item.area }}</span>
        <span>(库存{{ item.stock }})</span>
        <span class="checkItem" v-if="checkId == item.id"><i class="el-icon-check"></i></span>
      </div>
    </div>
  </div>
</template>

<script>
  import Cookie from "js-cookie";
  import {
    stockList
  } from "@/api/workarea";

  export default {
    data() {
      return {
        searchInp: '',
        areaData: [],
        areaItemData: [],
        checkId : ''
      }
    },
    created() {
      this.getList();
      var id = JSON.parse(localStorage.getItem('numordersmethodobj_zt')) ? JSON.parse(localStorage.getItem('numordersmethodobj_zt')).id : ''
      this.checkId = id
    },
    methods: {
      getList() {
        let that = this;
        stockList({
            itemCode: 'MA000016'
          }).then(function(res) {

            if (!!res && res.code == 20000) {
              that.areaData = res.data.info
              that.areaItemData = res.data.info

            } else if (!!res && res.code == 113005) {
              that.alertBox = {
                tip: res.message,
                visible: true
              };
              setTimeout(function() {
                that.$router.push("/login");
              }, 1000);
              localStorage.removeItem("moon_email");
            } else {
              that.alertBox = {
                tip: res.message,
                visible: true
              };
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      },

      // 点击取消
      cancalFun() {
        if (this.$route.query.onemore == 1) {
            this.$router.push({
              name: "ordercheck_zt",
              query: {
                orderedit: 1,
                onemore: 1
              }
            });
        } else {
          this.$router.push({
            name: "ordercheck_zt",
            query: {
              orderedit: 1
            }
          })
        }
      },

      // 选择工区
      areaselecr(item) {
        if (item.stock == 0) {

        } else {
          this.checkId = item.id
          var loca = JSON.parse(localStorage.getItem('numordersmethodobj_zt')) || {}
          loca.area = item.area
          loca.stock = item.stock
          loca.id = item.id
          loca.warehouseCode = item.warehouseCode
          localStorage.setItem('numordersmethodobj_zt', JSON.stringify(loca))
          if (this.$route.query.onemore == 1) {
              this.$router.push({
                name: "ordercheck_zt",
                query: {
                  orderedit: 1,
                  onemore: 1
                }
              });
          } else {
            this.$router.push({
              name: "ordercheck_zt",
              query: {
                orderedit: 1
              }
            })
          }

        }
      },

      // 搜索框输入
      inputChange() {
        var restaurants = this.areaItemData;
        var queryString = this.searchInp
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        this.areaData = JSON.parse(JSON.stringify(results))
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.area.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
        };
      }
    }
  }
</script>

<style scoped>
  .areaContent {
    background: #F4F4F4;
    min-height: 100%;
    position: relative;
    overflow: hidden;
  }

  .searchBox {
    height: 50px;
    overflow: hidden;
    background: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }

  .inpBox {
    height: 30px;
    background: #F4F4F4;
    border-radius: 11.5px;
    display: inline-block;
    width: 78%;
    float: left;
    margin-top: 10px;
    margin-left: 14px;
  }
  input::-webkit-input-placeholder{
    color: #DDDDDD;
  }

  .cancel {
    height: 50px;
    line-height: 50px;
    float: right;
    font-size: 14px;
    width: 10%;
    margin-right: 14px;
  }

  .icondiv {
    font-size: 14px;
    float: left;
    text-align: left;
    color: #DDDDDD;
    margin: 8px 5px 8px 10px;
  }

  .seartxt {
    float: left;
    height: 24px;
    margin-top: 3px;
    border: none;
    background: #F4F4F4;
    width: 80%;
    padding-left: 5px;
    outline: none;
  }

  .areaBox {
    margin-top: 50px;
  }

  .areaItem {
    height: 50px;
    line-height: 50px;
    background: #FFFFFF;
    border-top: 1px solid #F4F4F4;
    font-size: 14px;
    text-align: left;
    padding-left: 14px;
    color: #333333;
    overflow: hidden;
  }
  .noneStock{
    height: 50px;
    line-height: 50px;
    background: #F4F4F4;
    border-top: 1px solid #F4F4F4;
    font-size: 14px;
    text-align: left;
    padding-left: 14px;
    color: #cccccc;
    overflow: hidden;
  }
  .checkItem{
    font-size: 20px;
    color: #3485F9;
    font-weight: bold;
    float: right;
    margin-right: 20px;
  }
</style>
