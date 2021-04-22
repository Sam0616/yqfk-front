<template>
    <div class="role">
        <div class="seek">
            <div class="formContent">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="菜单名称" class="label">
                        <el-input v-model="menuName" placeholder="请输入菜单名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="roleList">
            <el-table v-loading="loading" :data="tableData" border row-key="id" lazy :load="load"
                      style=" width: 96%;margin-left:30px;margin-top:30px;" :header-cell-style="{background:'#f5f6fa'}">
                <el-table-column type="index" label="序号" width="60" header-align="center"
                                 align="center"></el-table-column>
                <!--<el-table-column prop="id" label="菜单编号" width="110" align="center"></el-table-column>-->
                <el-table-column prop="menuName" label="菜单名称" width="200" align="center"></el-table-column>
                <el-table-column prop="menuUrl" label="菜单地址" width="400" align="center"></el-table-column>
                <el-table-column prop="description" label="描述" width="200" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="menusList">
                        <el-button type="primary" size="max" class="config-btn" style="width:70px;"
                                   @click.native.prevent="editMenu()">编辑
                        </el-button>
                        <el-button type="danger" class="blue-btn" size="max" style="width:70px"
                                   @click.native.prevent="deleteMenu()">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="paginationCon">
                <el-pagination v-show="isShow" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-sizes="[10, 15, 20, 100]" :page-size='pageSize'
                               layout="total, sizes, prev, pager, next, jumper" :total="totals"></el-pagination>
            </div>
        </div>
        <!-- 添加文档弹出框 -->

    </div>
</template>
<script>

  export default {
    components: {},
    data () {
      return {
        menuForm: {
          id: '',
          menuName: '',
          menuUrl: '',
          description: ''
        },
        rules: {},
        formLabelWidth: '120px',
        isShow: true,
        loading: false,
        totals: 0,
        currentPage: 1,
        pageSize: 10,
        tableData: [{
          id: '1001',
          menuName: '用户管理',
          menuUrl: '/member/memberList',
          description: '用户管理'
        },
          {
            id: '1001',
            menuName: '角色管理',
            menuUrl: '/sys/roleList',
            description: '用户管理'
          },
          {
            id: '1001',
            menuName: '菜单管理',
            menuUrl: '/sys/menuTree',
            description: '用户管理'
          },
          {
            id: '1001',
            menuName: '个人历史轨迹查询',
            menuUrl: '/sys/getMenuListByRole',
            description: '个人历史轨迹查询'
          }
        ],
        editorData: '',
        taskId: ''
      }
    },
    // 过滤
    filters: {},
    // 模块新建时
    created: function () {

    },
    // 计算属性
    mounted () {

    },
    // 事件处理
    methods: {

      getUserList () {
        let self = this
        self.getMemberList({currentPage: this.currentPage, pageSize: this.pageSize}).then(res => {
          this.tableData = res.data.data
          this.totals = res.data.total
        })
      },

      // 搜索
      onSubmit () {
        this.getdeptListForm()
      },

      handleSizeChange (val) {
        let self = this
        self.pageSize = val
        self.getdeptListForm()
      },
      handleCurrentChange (val) {
        let self = this
        self.currentPage = val
        self.getdeptListForm()
      },
    },
    // 监视
    watch: {}
  }
</script>
<style scoped>
    .label {
        margin-left: 20px;
    }

    .role {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .seek {
        width: 98%;
        height: auto;
        margin: 10px auto;
        border: 1px solid #e6e6e6;
        background-color: #fff;
    }

    .roleList {
        width: 98%;
        height: auto;
        border: 1px solid #e6e6e6;
        margin: 10px auto;
        background-color: #fff;
        padding-bottom: 100px;
    }

    .formContent {
        width: 100%;
        height: 100%;
        margin: 30px auto;
    }

    .roleTop {
        width: 100%;
        height: 59px;
        border-bottom: 1px solid #e6e6e6;
    }

    .addRole {
        padding-left: 30px;
        padding-top: 10px;
    }

    .tableForm {
        width: 100%;
        height: 100%;
    }

    .iconSize {
        font-size: 16px;
    }

    .paginationCon {
        float: right;
        margin-top: 12px;
        margin-right: 30px;
    }
</style>
