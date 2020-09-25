<template>
  <div class="ordercheckBg ordercheckClass">
    <div v-bind:class="{ 'payloading': payloading }" class="ms_content">
        <div class="topcontent" v-if="!payloading">
            <div class="gqzt" @click="workarealink">
            <strong>*</strong>
            <span>工区</span>
            <i class="el-icon-arrow-right"></i>
            <span :class="ordercreate.area == '请选择工区'? 'tiShi' : 'checkTiShi'">{{ordercreate.area}}</span>
            <!-- <span>{{ordercreate.area}}</span> -->
            </div>
            <div class="emailzt">
            <strong>*</strong>
            <span>邮箱</span>


            <i class="el-icon-arrow-right" v-bind:class="{ 'emailztarrow': emailztarrow }"></i>
            <div class="emailztselectdiv">
                <el-select v-model="ordercreate.emailzt" size="small" class="emailztselect" placeholder="请选择" @change="emailztchange"
                @visible-change="emailztselect">
                <el-option v-for="item in emailztdata" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <input type="text" v-bind:class="{'textright': textright}" @input="emailztfeinput" maxlength="50" placeholder="请输入自取人邮箱"
                v-model="ordercreate.emailztfe" class="emailztfe" />
            </div>
        </div>
        <div class="topcontent" v-else>
            <div class="gqzt">
            <!-- <strong>*</strong>
            <span>{{ordercreate.area}}</span>
            <i class="el-icon-arrow-right"></i> -->
            <strong>*</strong>
            <span>工区</span>
            <i class="el-icon-arrow-right"></i>
            <span :class="ordercreate.area == '请选择工区'? 'tiShi' : 'checkTiShi'">{{ordercreate.area}}</span>
            </div>
            <div class="emailzt">
            <strong>*</strong>
            <span>邮箱</span>
            <!-- <input type="text" disabled maxlength="50" placeholder="自取人邮箱" v-model="ordercreate.emailztfe" class="emailztfe" /> -->

            <i class="el-icon-arrow-right" v-bind:class="{ 'emailztarrow': emailztarrow }"></i>
            <div class="emailztselectdiv">
                <div class="isDisabled">@{{ordercreate.emailzt}}</div>
                <!-- <el-select v-model="ordercreate.emailzt" size="small" class="emailztselect" placeholder="请选择" disabled>
                  <el-option v-for="item in emailztdata" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select> -->
            </div>
            <input type="text" disabled maxlength="50" placeholder="自取人邮箱" v-model="ordercreate.emailztfe" class="emailztfe" />
            </div>
        </div>
        <div class="order">
            <div class="orderh">
            <img :src="skuinfoparam.images? skuinfoparam.images : ''" />
            <div class="ordercenter">
                <span>{{skuinfoparam.itemName}}</span>
                <span v-if="stockdisabled">库存：{{ordercreate.stock}}</span>
                <span v-else></span>
                <span>¥{{skuinfoparam.shop_price}}/盒</span>
            </div>
            </div>
            <p class="paynumall" v-if="stockshow">
            <!-- 判断库存为0的时候，输入框为0，不可以增减 -->
            <span>购买数量</span>
            <span class="paynumallloading" v-if="!payloading">
                <i class="el-icon-circle-plus-outline" @click="paynumplus"></i>
                <input type="number" name="num" v-model="ordercreate.sku_list[0].sku_count" @input="paynuminput" @blur="paynumblur"
                value="paynum" />
                <i class="el-icon-remove-outline" @click="paynumremove"></i>
            </span>
            <span class="paynumallloading" v-else>
                <i class="el-icon-circle-plus-outline"></i>
                <input type="number" name="num" v-model="ordercreate.sku_list[0].sku_count" @input="paynuminput" @blur="paynumblur"
                disabled value="paynum" />
                <i class="el-icon-remove-outline"></i>
            </span>
            </p>
            <p class="paynumall" v-else>
            <span>购买数量</span>
            <span class="paynumallloading">
                <i class="el-icon-circle-plus-outline"></i>
                <input type="number" name="num" v-model="ordercreate.sku_list[0].sku_count" @input="paynuminput" @blur="paynumblur"
                disabled value="paynum" />
                <i class="el-icon-remove-outline"></i>
            </span>
            </p>

            <p>
            <span>发票</span>
            <em>交易完成后可开具发票</em>
            </p>
        </div>
        <div class="payType">
            <h3>
            支付方式
            <span class="payTypeTip">*请在五分钟之内支付</span>
            </h3>
            <label>
            <span class="wxicon"></span>微信支付
            <input type="radio" name="payType" v-model="ordercreate.pay_method" value="2" />
            </label>
        </div>
        <!-- <div class="payTipsc"><i>*</i>9月16日-9月19日持续发货，预计19日全部发货完成</div> -->
        <div class="payTogotop"></div>
        <div class="payTogo">
            <span v-if="allshowhide">
            合计：
            <em>¥{{priceallFunc(skuinfoparam.shop_price, ordercreate.sku_list[0].sku_count)}}</em>
            共{{allnumFunc(ordercreate.sku_list[0].sku_count)}}件
            </span>
            <span v-else>
            合计：
            <em>¥0</em>
            共0件
            </span>
            <button @click="paysubmit" v-if="paysubmitdisabled" v-preventReClick>去支付</button>
            <button v-else v-bind:class="{'paysubmitdisabled': !paysubmitdisabled}" disabled>去支付</button>
        </div>
    </div>
    <AlertBox :alertBox="alertBox.visible" @close="alertBox.visible=false">{{alertBox.tip}}</AlertBox>
    </div>
</template>

<script>
import Cookie from "js-cookie";
import AlertBox from "./alertbox";
import merge from "webpack-merge";
import {
    getaddresslistdata,
    skuinfo_zt,
    deleteaddress,
    ordercreateapi_zt,
    orderpollingpay
} from "@/api/ordercheck";
import { stockList } from "@/api/workarea";
export default {
    data() {
        return {
            areaType: '',
            textright: false,
            allshowhide: true,
            stockshow: true,
            stockdisabled: false,
            paysubmitdisabled: true,
            emailztarrow: false,
            emailztdata: [
                {
                    value: "bytedance.com",
                    label: "@bytedance.com"
                },
                {
                    value: "ad.bytedance.com",
                    label: "@ad.bytedance.com"
                },
                {
                    value: "jiyunhudong.com",
                    label: "@jiyunhudong.com"
                }
            ],

            detailowner: true,
            drawer: false,
            direction: "btt",
            selectaddress: {},
            param: {
                pay: ""
            },
            startX: 0,
            endX: 0,
            alertBox: {
                visible: false,
                tip: ""
            },
            addressData: [],
            orderCheckrules: {
                pay: [
                    {
                        required: true,
                        message: "请选择支付方式",
                        trigger: "blur"
                    }
                ]
            },
            moneyOrdercheck: "0",
            numberOrdercheck: "1",
            alertBoxVisible: false,
            alertBoxcontent: "",
            detailownerParam: {
                id: 1,
                receiver: "",
                phone: "",
                address: "",
                user_id: "",
                provincial: "",
                city: "",
                area: ""
            },
            priceall: "",
            orderprice: "",
            infoimages: "",
            itemName: "",
            skuinfoparam: {
                itemCode: "",
                shop_price: "",
                itemName: "",
                images: "",
                barCode: "",
                warehouseCode: "",
                actstock: "",
                status: "",
                created_at: "",
                updated_at: "",
                shop_price: "",
                freight: ""
            },
            drawerAddress: true,
            ordercreate: {
                out_biz_code: "",
                sku_list: [
                    {
                        sku_code: "",
                        sku_count: 1
                    }
                ],
                pay_method: 2, //1，支付宝 2，微信
                orderdes: "",
                invoice_info: {
                    id: "",
                    invoice_type: 1,
                    register_phone: "",
                    register_address: "",
                    taxpayer_number: "",
                    invoice_name: "",
                    register_bank: "",
                    register_bank_account: ""
                },
                is_invoice: 0, //默认不开发票
                pathway: 2,
                area: "请选择工区",
                emailztfe: "",
                emailzt: "bytedance.com",
                warehouseCode: "",
                stock: -1
            },
            maxnum: 5,
            onemore: !!this.$route.query.onemore
                ? this.$route.query.onemore
                : "",
            payloading:
                !!this.$route.query.payloading &&
                this.$route.query.payloading == 1
                    ? this.$route.query.payloading
                    : false,
            numordersmethodobj: {
                sku_count: 1, //数量
                orderdes: "",
                area: "请选择工区",
                pay_method: 2, //1，支付宝 2，微信
                emailztfe: "", //邮箱地址前缀
                emailzt: "bytedance.com", //邮箱地址后缀
                stock: -1,
                warehouseCode: ""
            }
        };
    },
    components: {
        AlertBox
    },
    created() {
        this.skuinfoFunc();

        this.initonemoreFunc();

        this.numordersmethod();
    },
    computed: {
        defaultAvatar() {
            return 'this.src="' + require("../assets/img/default.png") + '"';
        }
    },
    mounted() {
        if (this.ordercreate.emailztfe.length < 1) {
            this.textright = false;
        } else {
            this.textright = true;
        }
    },
    methods: {
        idfuncstock(data, _area) {
            let _stock = "";
            if (!!data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].area == _area) {
                        // if(this.$route.query.payloading == 1 && data[i].actstock == 0) {
                        //     _stock = 1;
                        // }else {
                            _stock = data[i].actstock;
                        // }
                    }
                }
            }

            return _stock;
        },
        actstockFunc(code, num) {
            let that = this;
            let data = {
                itemCode: code
            };
            stockList(data)
                .then(function(res) {
                    if (!!res && res.code == 20000) {
                        if (!!res.data.info && res.data.info.length > 0) {
                            let _area;
                            if(num == 0) {
                                _area = JSON.parse(
                                    localStorage.getItem("numordersmethodobj_zt")
                                ).area;
                            }
                            else {
                                _area = JSON.parse(
                                    localStorage.getItem("onemoreobj_zt")
                                ).snapshoot_cnt.receive_info.detailAddress;
                            }
                            that.ordercreate.stock = that.idfuncstock(
                                res.data.info,
                                _area
                            );
                        }
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
        emailztfeinput() {
            if (this.ordercreate.emailztfe.length < 1) {
                this.textright = false;
            } else {
                this.textright = true;
            }

            this.$router.push({
                query: merge(this.$route.query, {
                    orderedit: 1
                })
            });
            let l = JSON.parse(localStorage.getItem("numordersmethodobj_zt"));
            l.emailztfe = this.ordercreate.emailztfe;
            localStorage.setItem("numordersmethodobj_zt", JSON.stringify(l));
        },
        emailztchange() {
            this.$router.push({
                query: merge(this.$route.query, {
                    orderedit: 1
                })
            });
            let l = JSON.parse(localStorage.getItem("numordersmethodobj_zt"));
            l.emailzt = this.ordercreate.emailzt;
            localStorage.setItem("numordersmethodobj_zt", JSON.stringify(l));
        },
        workarealink() {
            this.$router.push({
                name: "workarea",
                query: {
                    itemCode: this.skuinfoparam.itemCode,
                    onemore: this.$route.query.onemore
                }
            });
        },
        emailztselect(e) {
            this.emailztarrow = e;
        },

        //初始执行内容存储
        numordersmethod() {
            let _l_nom = JSON.parse(
                localStorage.getItem("numordersmethodobj_zt")
            );
            if (!_l_nom) {
                localStorage.setItem(
                    "numordersmethodobj_zt",
                    JSON.stringify(this.numordersmethodobj)
                );
            }
            let _onemore = JSON.parse(localStorage.getItem("onemoreobj_zt"));

            if (!!_l_nom) {
                if (!_onemore || this.$route.query.orderedit == 1) {

                    this.ordercreate.orderdes = _l_nom.orderdes;
                    this.ordercreate.pay_method = _l_nom.pay_method;
                    this.ordercreate.area = _l_nom.area;
                    this.ordercreate.emailztfe = _l_nom.emailztfe;
                    this.ordercreate.emailzt = _l_nom.emailzt;
                    this.ordercreate.stock = _l_nom.stock;
                    this.ordercreate.warehouseCode = _l_nom.warehouseCode;

                    if (this.ordercreate.stock > 0) {
                        this.ordercreate.sku_list[0].sku_count = _l_nom.sku_count;
                        //判断库存数量大于0的时候去支付按钮正常显示,库存显示
                        this.stockdisabled = true;
                        this.paysubmitdisabled = true;
                        this.allshowhide = true;
                        this.stockshow = true;
                    } else if (this.ordercreate.stock < 0) {
                        this.ordercreate.sku_list[0].sku_count = _l_nom.sku_count;
                        //库存数量初始的时候去支付按钮正常显示,库存不显示
                        this.stockdisabled = false;
                        this.paysubmitdisabled = true;
                        this.stockshow = true;
                        this.allshowhide = true;
                    } else if (this.ordercreate.stock == 0) {
                        //库存数量初始的时候去支付按钮置灰,库存显示
                        this.stockdisabled = true;
                        this.paysubmitdisabled = false;
                        this.stockshow = false;
                        this.allshowhide = true;
                        this.ordercreate.sku_list[0].sku_count = 1;
                    }
                }
            }
        },
        // 再来一单
        initonemoreFunc() {
            let that = this;
            let onemoreobj = JSON.parse(localStorage.getItem("onemoreobj_zt"));
            let orderedit = this.$route.query.orderedit;

            if (this.onemore == 1 && orderedit != 1) {
                this.skuinfoparam.images = !!onemoreobj.snapshoot_cnt
                    .sku_list[0].images
                    ? onemoreobj.snapshoot_cnt.sku_list[0].images[0]
                    : "";
                this.skuinfoparam.itemName =
                    onemoreobj.snapshoot_cnt.sku_list[0].itemName;
                this.skuinfoparam.freight =
                    onemoreobj.snapshoot_cnt.sku_list[0].freight;

                this.skuinfoparam.shop_price =
                    onemoreobj.snapshoot_cnt.sku_list[0].shop_price;

                this.skuinfoparam.itemCode =
                    onemoreobj.snapshoot_cnt.sku_list[0].itemCode;
                this.ordercreate.sku_list[0].sku_count =
                    onemoreobj.snapshoot_cnt.sku_list[0].sku_count;

                this.ordercreate.is_invoice =
                    onemoreobj.snapshoot_cnt.is_invoice;
                this.ordercreate.orderdes = !!onemoreobj.snapshoot_cnt.orderdes
                    ? onemoreobj.snapshoot_cnt.orderdes
                    : "";
                this.ordercreate.pay_method =
                    onemoreobj.snapshoot_cnt.pay_method == 1 ||
                    onemoreobj.snapshoot_cnt.pay_method == 2
                        ? 2
                        : 2;

                this.ordercreate.pathway = onemoreobj.snapshoot_cnt.pathway;
                this.ordercreate.warehouseCode =
                    onemoreobj.snapshoot_cnt.warehouseCode;
                this.ordercreate.area =
                    onemoreobj.snapshoot_cnt.receive_info.detailAddress;
                this.ordercreate.emailztfe = onemoreobj.snapshoot_cnt.receive_info.email.substring(
                    0,
                    onemoreobj.snapshoot_cnt.receive_info.email.indexOf("@")
                );
                this.ordercreate.emailzt = onemoreobj.snapshoot_cnt.receive_info.email.substring(
                    onemoreobj.snapshoot_cnt.receive_info.email.indexOf("@") +
                        1,
                    onemoreobj.snapshoot_cnt.receive_info.email.length
                );

                this.numordersmethodobj.area =
                    onemoreobj.snapshoot_cnt.receive_info.detailAddress;
                this.numordersmethodobj.sku_count =
                    onemoreobj.snapshoot_cnt.sku_list[0].sku_count;
                this.numordersmethodobj.emailztfe = onemoreobj.snapshoot_cnt.receive_info.email.substring(
                    0,
                    onemoreobj.snapshoot_cnt.receive_info.email.indexOf("@")
                );
                this.numordersmethodobj.emailzt = onemoreobj.snapshoot_cnt.receive_info.email.substring(
                    onemoreobj.snapshoot_cnt.receive_info.email.indexOf("@") +
                        1,
                    onemoreobj.snapshoot_cnt.receive_info.email.length
                );

                that.actstockFunc(this.skuinfoparam.itemCode, 1);
                this.stockdisabled = true;
                localStorage.setItem(
                    "numordersmethodobj_zt",
                    JSON.stringify(this.numordersmethodobj)
                );
            }
        },

        allnumFunc(num) {
            return num == "" || num < 1 ? 1 : num;
        },
        priceallFunc(price, num) {
            if (Number(num) < 1 && Number(num) !== "") {
                num = 1;
            }
            return (
                ((Number(num) * Number(price) +
                    Number(this.skuinfoparam.freight)) *
                    100) /
                100
            ).toFixed(2);
        },
        //获取月饼商品详情
        skuinfoFunc() {
            let that = this;
            skuinfo_zt()
                .then(function(res) {
                    if (!!res && res.code == 20000) {
                        let _info = res.data.info;

                        that.skuinfoparam.shop_price = _info.shop_price; //商品价格
                        that.skuinfoparam.images = !!_info.images
                            ? _info.images[0]
                            : "";
                        that.skuinfoparam.itemName = _info.itemName;
                        that.skuinfoparam.actstock = _info.actstock;
                        // that.maxnum = _info.actstock;
                        that.skuinfoparam.itemCode = _info.itemCode;
                        that.skuinfoparam.shop_price = _info.shop_price;
                        that.skuinfoparam.barCode = _info.barCode;
                        that.skuinfoparam.warehouseCode = _info.warehouseCode;
                        that.skuinfoparam.status = _info.status;
                        that.skuinfoparam.created_at = _info.created_at;
                        that.skuinfoparam.updated_at = _info.updated_at;
                        that.skuinfoparam.freight = _info.freight;

                        that.actstockFunc(that.skuinfoparam.itemCode, 0);
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
        paynumblur() {
            if (this.ordercreate.sku_list[0].sku_count == "") {
                this.ordercreate.sku_list[0].sku_count = 1;
            }
            this.storagecount();
        },

        paynumplus() {
            if (Number(this.ordercreate.sku_list[0].sku_count) < this.maxnum) {
                this.ordercreate.sku_list[0].sku_count =
                    Number(this.ordercreate.sku_list[0].sku_count) + 1;
                this.priceall = this.priceallFunc(
                    this.skuinfoparam.shop_price,
                    this.ordercreate.sku_list[0].sku_count
                );
            }
            this.storagecount();
        },
        paynumremove() {
            if (this.ordercreate.sku_list[0].sku_count > 1) {
                this.ordercreate.sku_list[0].sku_count =
                    Number(this.ordercreate.sku_list[0].sku_count) - 1;
            } else {
                this.ordercreate.sku_list[0].sku_count = 1;
            }
            this.priceall = this.priceallFunc(
                this.skuinfoparam.shop_price,
                this.ordercreate.sku_list[0].sku_count
            );
            this.storagecount();
        },
        paynuminput() {
            if (Number(this.ordercreate.sku_list[0].sku_count) > this.maxnum) {
                this.ordercreate.sku_list[0].sku_count = this.maxnum;
            } else if (this.ordercreate.sku_list[0].sku_count == 0) {
                if (this.ordercreate.sku_list[0].sku_count.length > 0) {
                    this.ordercreate.sku_list[0].sku_count = 1;
                }
            } else if (Number(this.ordercreate.sku_list[0].sku_count) < 0) {
                this.ordercreate.sku_list[0].sku_count = 1;
            } else {
                this.ordercreate.sku_list[0].sku_count = Number(
                    this.ordercreate.sku_list[0].sku_count
                );
            }
            this.storagecount();
        },
        storagecount() {
            this.numordersmethodobj = !!JSON.parse(
                localStorage.getItem("numordersmethodobj_zt")
            )
                ? JSON.parse(localStorage.getItem("numordersmethodobj_zt"))
                : this.numordersmethodobj;
            this.numordersmethodobj.sku_count = this.ordercreate.sku_list[0].sku_count;
            // console.log(this.numordersmethodobj);
            localStorage.setItem(
                "numordersmethodobj_zt",
                JSON.stringify(this.numordersmethodobj)
            );
            this.$router.push({
                query: merge(this.$route.query, {
                    orderedit: 1
                })
            });
        },

        //创建订单
        paysubmit() {
            let that = this;
            let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]$/;
            if (that.ordercreate.area == "请选择工区") {
                that.alertBox = {
                    tip: "请选择工区",
                    visible: true
                };
            } else if (that.ordercreate.emailztfe == "") {
                that.alertBox = {
                    tip: "请输入自取人邮箱",
                    visible: true
                };
            } else if (that.ordercreate.emailztfe != "") {
                // if (!reg.test(that.ordercreate.emailztfe)) {
                if (false) {
                    that.alertBox = {
                        tip: "自取人邮箱格式不正确",
                        visible: true
                    };
                } else {
                    let _out_biz_code =
                        this.$route.query.payloading == 1
                            ? JSON.parse(
                                  localStorage.getItem("onemoreobj_zt")
                              ).out_biz_code.substring(
                                  JSON.parse(
                                      localStorage.getItem("onemoreobj_zt")
                                  ).out_biz_code.indexOf("_") + 1,
                                  JSON.parse(
                                      localStorage.getItem("onemoreobj_zt")
                                  ).out_biz_code.length
                              )
                            : new Date().getTime() +
                              "" +
                              Math.floor(Math.random() * 4000 + 1000);

                    let _warehouseCode;
                    if(this.$route.query.onemore == 1) {
                        // _warehouseCode = JSON.parse(localStorage.getItem('onemoreobj_zt')).snapshoot_cnt.warehouseCode;
                        _warehouseCode = JSON.parse(localStorage.getItem('numordersmethodobj_zt')).warehouseCode;
                    }else {
                        // _warehouseCode = that.ordercreate.warehouseCode;
                        _warehouseCode = JSON.parse(localStorage.getItem('numordersmethodobj_zt')).warehouseCode;
                    }
                    let data = {
                        out_biz_code: _out_biz_code,
                        sku_list: [
                            {
                                sku_code: that.skuinfoparam.itemCode,
                                sku_count:
                                    that.ordercreate.sku_list[0].sku_count
                            }
                        ],
                        pay_method: that.ordercreate.pay_method,
                        receive_info: {
                            email: `${that.ordercreate.emailztfe}@${that.ordercreate.emailzt}`,
                            detailAddress: that.ordercreate.area
                        },
                        orderdes: that.ordercreate.orderdes,
                        itemCode: that.skuinfoparam.itemCode,
                        warehouseCode: _warehouseCode,
                        is_invoice: 0, //是否开发票	0否 1是
                        pathway: 2, //环境配置	1,2
                        usage_scenario: "bytemoon_self" //bytemoon_pay 月饼支付 bytemoon_exchange 月饼兑换 bytemoon_self 自提
                    };

                    ordercreateapi_zt(data)
                        .then(function(res) {
                            if (!!res && res.code == 20000) {
                                //将商品code存在localstorge里
                                localStorage.setItem(
                                    "order_code_zt",
                                    res.data.order_code
                                );
                                localStorage.setItem("order_isload_zt", 1);
                                localStorage.setItem("orderloadingtime_zt", 0);
                                localStorage.setItem("detailType", 2);

                                if (that.ordercreate.pay_method == 1) {
                                    //1是支付宝 2是微信
                                    that.alipay(res);
                                } else {
                                    that.wxpay(res);
                                }
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
                }
            }
        },

        wxpay(res) {
            const _html = res.data.html;
            const div = document.createElement("div");
            div.innerHTML = _html;
            document.body.appendChild(div);
        },
        alipay(res) {
            const form = res.data.html;
            const div = document.createElement("div");
            div.id = "alipay";
            div.innerHTML = form;
            document.body.appendChild(div);
            document.querySelector("#alipay").children[0].submit();
        }
    }
};
</script>


<style scoped lang="less">
.ordercheckClass {
    height: 100%;

    input[disabled],
    input:disabled,
    input.disabled {
        color: #696464;
        -webkit-text-fill-color: #696464;
        -webkit-opacity: 1;
        opacity: 1;
    }

    select[disabled="disabled"]::-ms-value {
        color: #696464;
    }

    .payTogo button.paysubmitdisabled {
        background: #cccccc;
    }

    input.emailztfe::-webkit-input-placeholder {
        color: #333333;
    }

    .emailztfe.textright {
        text-align: right;
    }

    .emailztfe {
      float: right;
      margin: 15px 0 0 0;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      border: 0;
      text-align: left;
      height: 26px;
      line-height: 26px;
      outline: 0;
      text-align: right;
      font-size: 14px;
      width: 1.2rem;
    }

    input::-webkit-input-placeholder{
        color:#9B9B9B !important;
    }

    .emailzt em {
        font-style: normal;
        float: right;
        margin: 17px -12px 0 0;
        position: relative;
        z-index: 1;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
    }

    .emailztselectdiv {
      float: right;
      margin: 12px 0 0;
      width: 1.6rem;
      overflow: hidden;
      color: #696464!important;
    }

    .emailztselect {
        width: 1.9rem;
        border: 0;
    }

    .topcontent {
        width: 100%;
        background: #ffffff;
    }

    .topcontent .gqzt {
        border-bottom: #f4f4f4 solid 1px;
    }

    .topcontent .gqzt,
    .topcontent .emailzt {
        overflow: hidden;
        min-height: 56px;
    }

    .topcontent .emailzt i.emailztarrow {
        transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        /* IE 9 */
        -webkit-transform: rotate(90deg);
        /* Safari and Chrome */
    }

    .topcontent .gqzt i,
    .topcontent .emailzt i {
        float: right;
        margin: 22px 10px 0 0;
        /* color: #C8C8C8; */
    }

    .topcontent .gqzt span,
    .topcontent .emailzt span {
        float: left;
        line-height: 56px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
    }

    .tiShi{
      float: right !important;
      margin-right: 10px;
      color: #9B9B9B !important;
      font-size: 12px !important;
    }
    .checkTiShi{
      float: right !important;
      margin-right: 10px;
    }
    .isDisabled{
      height: 32px;
      line-height: 32px;
      font-size: 16px;
    }







    .topcontent .gqzt strong,
    .topcontent .emailzt strong {
        color: #ea626c;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        float: left;
        margin: 20px 3px 0 12px;
    }

    .payloading .detailowner p,
    .payloading .payTogo span,
    .payloading .payTogo span em,
    .payloading .el-icon-location-outline,
    .payloading .order p span,
    .payloading .order p em,
    .payloading .order p em input,
    .payloading .paynumall span,
    .payloading .paynumall span input,
    .payloading .detailowner .el-icon-arrow-right,
    .payloading .ordercenter span,
    .payloading .topcontent .gqzt span,
    .payloading .topcontent .emailzt .emailztfe,
    .payloading .el-input.is-disabled .el-input__inner,
    .payloading .topcontent i,
    .payloading .topcontent em,
    .payloading .topcontent strong {
        color: #696464 !important;
    }

    .payTipsc i {
        display: inline-block;
        font-size: 10px;
        margin-right: 5px;
        font-family: FZLTHJW--GB1-0, FZLTHJW--GB1;
        font-weight: normal;
        color: #ff502c;
        font-style: normal;
    }

    .payTipsc {
        display: block;
        padding: 10px 0 0 10px;
        text-align: left;
        font-size: 14px;
        line-height: 15px;
    }

    .detailowner_bottom_bg {
        width: 110%;
    }

    .payTypeTip {
        float: right;
        font-size: 10px;
        margin-right: 12px;
        font-family: FZLTHJW--GB1-0, FZLTHJW--GB1;
        font-weight: normal;
        color: #ff502c;
    }

    .payTogotop {
        position: relative;
        height: 50px;
        top: 10px;
        overflow: hidden;
    }

    .detailowner_bottom {
        height: 0.04rem;
        line-height: 0.04rem;
        overflow: hidden;
        position: absolute;
        bottom: 0;
        left: 0;
    }

    .detailowner_bottom .bgicon1 {
        background: #325ab4;
    }

    .detailowner_bottom .bgicon2 {
        background: #00c8d2;
    }

    .detailowner_bottom span {
        margin: 0 0.13rem 0 0;
        width: 0.27rem;
        height: 0.04rem;
        -webkit-transform: skew(-45deg);
        -moz-transform: skew(-45deg);
        -o-transform: skew(-45deg);
        transform: skew(-45deg);
        display: inline-block;
        float: left;
    }

    .el-icon-arrow-right.company {
        margin: 20px 12px 0 0;
    }

    .order p span.invoicecontent {
        float: right;
        width: 2.7rem;
        padding: 14px 0 5px 12px;
    }

    .order p .invoicecontent em {
        line-height: 18px;
        display: block;
        width: 100%;
        text-align: right;
        word-break: break-all;
    }

    .ordercheckBg {
        background: #f4f4f4;
        height: 100%;
    }

    .payloading .orderh img {
        opacity: 0.5;
    }

    .order p span.paynumallloading {
        float: right;
    }

    .ms_content {
        font-size: 14px;
        background: #f4f4f4;
        height: 100%;
    }

    .wxicon {
        float: left;
        background-image: url(../assets/img/wx.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 23px;
        height: 21px;
        margin: 13px 8px 0 10px;
    }

    .alipayicon {
        float: left;
        background-image: url(../assets/img/alipay.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 23px;
        height: 23px;
        margin: 12px 8px 0 10px;
    }

    .orderdes {
        border: 0;
        outline: 0;
        width: 2.4rem;
        float: right;
        margin: 15px 2px 0 0;
        text-align: right;
    }

    .orderCheckaddress p {
        line-height: 100px;
        font-size: 16px;
        color: #9b9b9b;
    }

    .paynumall input {
        border: 0;
        font-size: 15px;
        outline: 0;
        width: 30px;
        text-align: center;
        margin: 15px 2px 0;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        float: right;
    }

    .paynumall .el-icon-circle-plus-outline,
    .paynumall .el-icon-remove-outline {
        float: right;
        font-size: 26px;
        margin: 10px 0 0;
        padding: 0;
    }

    .paynumall .el-icon-circle-plus-outline {
        margin-right: 12px;
    }

    .orderCheckaddress .delete {
        width: 0.48rem;
        height: 100%;
        line-height: 58px;
        background: #3c8cff;
        font-size: 12px;
        color: #fff;
        text-align: center;
        position: absolute;
        top: 0;
        display: table;
        vertical-align: middle;
        right: -0.48rem;
    }

    .orderCheckaddress h3 {
        position: relative;
        text-align: left;
        font-size: 14px;
        left: 16px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 40px;
        height: 40px;
    }

    .drawerAddress li label:focus {
        outline: 0;
    }

    .drawerAddress li {
        list-style-type: none;
        margin: 0;
        padding: 0;
        min-height: 60px;
        border-bottom: #f4f4f4 solid 1px;
        position: relative;
        -webkit-transition: all 0.2s;
        transition: all 0.2s;
    }

    .drawerAddress li .list-box label {
        width: 100%;
        height: 100%;
        padding-bottom: 5px;
        /* overflow: hidden; */
        /* background: #f4f4f4; */
    }

    .drawerAddress li .list-box {
        padding: 5px 0;
        display: flex;
        align-items: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        justify-content: flex-end;
    }

    .drawerAddress li[data-type="0"] {
        transform: translate3d(0, 0, 0);
    }

    .drawerAddress li[data-type="1"] {
        transform: translate3d(-0.48rem, 0, 0);
    }

    .drawerAddress li span {
        position: relative;
        width: 75%;
        text-align: left;
        top: 5px;
        left: 47px;
        float: left;
        font-size: 14px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
        /* display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden; */
    }

    .drawerAddress li em {
        position: relative;
        top: 7px;
        float: left;
        text-align: left;
        width: 100%;
        left: 47px;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        color: rgba(155, 155, 155, 1);
        line-height: 17px;
    }

    .drawerAddress li i {
        background-image: url("../assets/img/edit.png");

        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 18px;
        height: 18px;
        position: absolute;
        top: 22px;
        right: 17px;
    }

    .drawerAddress li input {
        position: absolute;
        top: 25px;
        left: 16px;
    }

    .drawerAddress {
        margin: 0;
        padding: 0;
        height: 2.2rem;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 0 0 36px;
    }

    .orderCheckaddress button i {
        background-image: url("../assets/img/add.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 24px;
        height: 24px;
        display: inline-block;
        left: 0.9rem;
        position: absolute;
    }

    .orderCheckaddress button {
        position: absolute;
        bottom: 10px;
        left: 0.15rem;
        width: 3.45rem;
        height: 47px;
        background: #f7f7f7;
        border-radius: 23.5px;
        border: 0;
        outline: 0;
        font-size: 18px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 25px;
    }

    .payTogo button {
        float: right;
        margin: 7px 12px 0 0;
        width: 90px;
        height: 36px;
        background: linear-gradient(
            90deg,
            rgba(27, 123, 255, 1) 0%,
            rgba(12, 97, 216, 1) 100%
        );
        border-radius: 18px;
        outline: 0;
        border: 0;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
    }

    .payTogo span em {
        font-size: 14px;
        color: rgba(255, 80, 44, 1);
        font-style: normal;
        display: inline-block;
        margin-right: 6px;
    }

    .payTogo span {
        float: left;
        font-size: 12px;
        margin-left: 12px;
    }

    .payTogo {
        height: 50px;
        line-height: 50px;
        background: #ffffff;
        position: fixed;

        bottom: 0;
        width: 100%;
    }

    .payType h3 {
        height: 29px;
        border-bottom: #f4f4f4 solid 1px;
        margin: 0;
        padding: 0 0 0 10px;
        line-height: 32px;
        color: #333333;
        font-weight: 400;
        text-align: left;
        overflow: hidden;
    }

    .payType {
        height: 80px;
        background: #ffffff;
        margin-top: 10px;
    }

    .payType label:nth-child(2) {
        /* border-bottom: #f4f4f4 solid 1px; */
        height: 46px;
    }

    .payType label img {
        width: 23px;
        height: 23px;
        float: left;
        margin: 13px 10px 0;
    }

    .payType label {
        line-height: 50px;
        display: block;
        text-align: left;
    }

    .payType label input {
        float: right;
        margin: 20px 12px 0 0;
    }

    .detailowner {
        background: #ffffff;
        min-height: 88px;
        position: relative;
        overflow: hidden;
    }

    .detailowner .el-icon-arrow-right {
        position: absolute;
        top: 30px;
        right: 6px;
        font-size: 18px;
    }

    .detailowner .el-icon-location-outline {
        position: relative;
        top: 30px;
        float: left;
        left: 12px;
        font-size: 25px;
    }

    .detailowner p {
        position: relative;
        left: 20px;
        text-align: left;
        margin: 0;
    }

    .detailowner p:nth-child(2) span {
        font-size: 14px;
        font-weight: 500;
        margin-right: 5px;
    }

    .detailowner p:nth-child(2) {
        top: 17px;
        color: #333333;
        font-size: 12px;
    }

    .detailowner p:nth-child(3) {
        top: 35px;
        color: #333333;
        font-size: 12px;
        width: 2.9rem;
    }

    .detailowner_address span {
        display: table-cell;
        vertical-align: middle;
        text-align: left;
    }

    .detailowner p.detailowner_address {
        display: table;
        top: 20px;
        padding: 0 0 40px;
    }

    .order {
        position: relative;
        overflow: hidden;
        margin-top: 10px;
        background: #ffffff;
    }

    .orderh img {
        width: 90px;
        height: 90px;
        position: absolute;
        top: 10px;
        left: 10px;
    }

    .orderh {
        height: 110px;
        border-bottom: #f4f4f4 solid 1px;
    }

    .ordercenter {
        position: absolute;
        left: 113px;
        margin: 0;
        text-align: left;
    }

    .ordercenter span:nth-child(1) {
        font-weight: 400;
        top: 15px;
    }

    .ordercenter span:nth-child(2) {
        font-size: 12px;
        color: #9b9b9b;
        top: 15px;
    }

    .ordercenter span:nth-child(3) {
        top: 40px;
    }

    .order p i {
        float: right;
        margin: 15px 12px 0 0;
    }

    .order p em {
        float: right;
        font-style: normal;
        margin: 0 12px 0 5px;
    }

    .order p span {
        color: #333333;
        float: left;
        padding-left: 12px;
    }

    .order p {
        overflow: hidden;
        margin: 0;
        line-height: 46px;
        border-bottom: #f4f4f4 solid 1px;
    }

    .orderNum {
        font-size: 14px;
        color: #333333;
        font-weight: 400;
        line-height: 20px;
        position: absolute;
        top: 44px;
        right: 13px;
    }

    .ordercenter span {
        position: relative;
        font-size: 14px;
        width: 1.5rem;
        display: block;
    }

    .detailowneraddress {
        position: absolute;
        left: 63px;
        color: #333333;
        font-size: 22px;
        line-height: 90px;
    }

    .detailowner .detailowneradd {
        background-image: url(../assets/img/add.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 30px;
        height: 30px;
        position: absolute;
        top: 28px;
        left: 17px;
    }
}
</style>
