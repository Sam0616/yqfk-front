<!--个人综合感染风险-->
<template>
  <div class="role">
    <div class="seek">
      <div class="formContent">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="手机号">
            <el-input v-model="roleName" placeholder="请输入内容"></el-input>
          </el-form-item>
          <!-- <el-date-picker label="开始日期" v-model="startTime" type="date" placeholder="选择日期"></el-date-picker> -->
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="roleList">
      <!-- <div class="roleTop">
        <div class="addRole">
          <el-button @click="addRole" type="primary" icon="el-icon-circle-plus-outline">添加文档</el-button>
        </div>
      </div>-->
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        row-key="id"
        lazy
        :load="load"
        style=" width: 96%;margin-left:30px;margin-top:30px;"
        :header-cell-style="{background:'#f5f6fa'}"
      >
        <el-table-column type="index" label="序号" width="60" header-align="center" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号码" width="180" align="center"></el-table-column>
        <el-table-column prop="datatime" label="查询时间" width="180" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.sex | filterPerms}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="180" align="center"></el-table-column>
        <el-table-column prop="safetyFactor" label="用户安全系数" width="180" align="center"></el-table-column>
        <el-table-column prop="riskAreaNum" label="经过患病风险区域的个数" width="180" align="center"></el-table-column>
        <el-table-column prop="trackSim" label="与患者历史轨迹的最大相似度" width="180" align="center"></el-table-column>
        <el-table-column
          prop="newPatientTrackSim"
          label="与昨天新增患者轨迹的最大相似度"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column prop="trackSimNum" label="与多少患者有超50%的轨迹相似度" width="180" align="center"></el-table-column>
      </el-table>
      <!-- <div class="paginationCon">
          <el-pagination
            v-show="Isshow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 15, 20, 100]"
            :page-size='pageSize'
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals"
          ></el-pagination>
      </div>-->
    </div>
    <!-- 添加文档弹出框 -->
    <el-dialog
      :close-on-click-modal="false"
      width="40%"
      title="添加文档"
      :visible.sync="addRoleVisible"
      :append-to-body="true"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="文档标题" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级文档" prop="parent_id" :label-width="formLabelWidth">
          <SelectTree
            :props="props"
            :options="optionData"
            :value="valueId"
            v-model="form.parent_id"
            :clearable="isClearable"
            :accordion="isAccordion"
            @getValue="getValue($event)"
          />
        </el-form-item>
        <el-form-item label="文档内容" prop="content" :label-width="formLabelWidth">
          <editor :editorDataMes="editorData" @editorDatas="editorDataFun"></editor>
        </el-form-item>
        <el-form-item label="序号" prop="order_num" :label-width="formLabelWidth">
          <el-input v-model="form.order_num" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="perms" :label-width="formLabelWidth">
          <el-input v-model="form.perms" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="confirm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

    export default {

        data() {
            return {
                form: {
                    title: "",
                    remark: "",
                    editorContent: "",
                    perms: "",
                    order_num: "",
                    parent_id: ""
                },
                icon: "",
                optionData: [
                    {
                        id: 0,
                        title: "顶级文档"
                    }
                ],
                isClearable: true, // 可清空（可选）
                isAccordion: true, // 可收起（可选）
                valueId: 0, // 初始ID（可选）
                props: {
                    // 配置项（必选）
                    value: "id",
                    label: "title",
                    children: "children"
                    // disabled:true
                },
                rules: {
                    name: [{ required: true, message: "请输入文档名称", trigger: "blur" }],
                    parent_id: [
                        { required: true, message: "请选择上级文档", trigger: "blur" }
                    ]
                    // remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
                },
                IsSeek: false,
                formLabelWidth: "60px",
                addRoleVisible: false,
                Isshow: false,
                loading: false,
                totals: 0,
                startTime: "",
                roleName: "",
                currentPage: 1,
                pageSize: 10,
                tableData: [],
                editorData: "",
                taskId: ""
            };
        },
        // 过滤
        filters: {
            filterStatus(val) {
                return val == "0" ? "未使用" : "已使用";
            },
            filterPerms(val) {
                return val == "0" ? "男" : "女";
            }
        },
        // 模块新建时
        created: function() {
            // this.getdeptListForm();
        },
        // 计算属性
        mounted() {},
        // 事件处理
        methods: {
            editorDataFun(value) {
                this.form.editorContent = value;
            },
            selectedIcon(name) {
                this.form.dept_icon = name;
            },
            // 确认删除
            open(row) {
                let self = this;
                this.$confirm("确认要删除此文档吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        console.log(row);
                        self
                            .getDeleteDoc({
                                id: row.id
                            })
                            .then(data => {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.getdeptListForm();
                            });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            },
            // 确定添加文档
            confirm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let self = this;
                        let IsEdit = sessionStorage.getItem("edit");
                        // 1为编辑,0为新增
                        if (IsEdit == "1") {
                            let deptId = sessionStorage.getItem("deptId");
                            self
                                .getUpdateDoc({
                                    id: parseInt(deptId),
                                    title: self.form.title,
                                    content: self.form.editorContent,
                                    parent_id: parseInt(self.form.parent_id),
                                    perms: parseInt(self.form.perms),
                                    order_num: parseInt(self.form.order_num)
                                })
                                .then(data => {
                                    this.addRoleVisible = false;
                                    this.$refs[formName].resetFields();
                                    this.getdeptListForm();
                                });
                        } else if (IsEdit == "0") {
                            self
                                .getCreateDoc({
                                    title: self.form.title,
                                    content: self.form.editorContent,
                                    parent_id: self.form.parent_id,
                                    perms: parseInt(self.form.perms),
                                    order_num: parseInt(self.form.order_num)
                                })
                                .then(data => {
                                    this.addRoleVisible = false;
                                    this.$refs[formName].resetFields();
                                    this.getdeptListForm();
                                });
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 取消
            resetForm(formName) {
                this.addRoleVisible = false;
                this.$refs[formName].resetFields();
            },
            // 添加文档
            addRole() {
                let self = this;
                (self.form = {
                    title: "",
                    remark: "",
                    editorContent: "",
                    perms: "",
                    order_num: "",
                    parent_id: ""
                }),
                    (self.editorData = "");
                self.valueId = 0;
                self.form.parent_id = 0;
                sessionStorage.setItem("edit", "0");
                self.addRoleVisible = true;
            },

            //删除单个文档数据
            remove(row) {
                let self = this;
                self.open(row);
            },
            // 编辑单条文档数据
            edit(row) {
                let self = this;
                self.form.title = row.title;
                self.form.parent_id = row.parent_id || "0";
                self.valueId = row.parent_id || "0";
                self.form.perms = row.perms;
                self.form.remark = row.remark;
                self.editorData = row.content;
                sessionStorage.setItem("edit", "1");
                sessionStorage.setItem("deptId", row.id);
                self.addRoleVisible = true;
            },
            // 搜索
            onSubmit() {
                this.getdeptListForm();
            },
            // 获取文档列表
            getdeptListForm() {
                let self = this;
                self.taskId = randomRange(12);
                self
                    .getAppList({
                        taskid: self.taskId,
                        jobid: 3,
                        phone: self.roleName
                    })
                    .then(data => {
                        if (data.code == "0") {
                            setInterval(() => {
                                if(this.getTaskStatusIng()){
                                    clearInterval()
                                    this.getTaskResultForm()
                                    return
                                }
                            }, 1000);
                        }else{
                            this.$message({
                                type:'info',
                                message:data.msg
                            })
                        }
                    });
            },
            // 获取任务状态
            getTaskStatusIng() {
                let self = this;
                self
                    .getTaskStatus({
                        taskid: self.taskId
                    })
                    .then(data => {
                        if(data.code == '0'){
                            if(data.result = '1'){
                                return true
                            }else{
                                return false
                            }
                        }else{
                            this.$message({
                                type:'info',
                                message:data.msg
                            })
                        }
                    });
            },
            // 获取任务结果
            getTaskResultForm() {
                let self = this;
                self
                    .getTaskResult({
                        taskid: self.taskId
                    })
                    .then(data => {
                        if (data.code == "0") {
                            self.tableData = data.data.tableData;
                        }else{
                            this.$message({
                                type:'info',
                                message:data.msg
                            })
                        }
                    });
            },
            load(tree, treeNode, resolve) {
                resolve([]);
            },
            // 取值
            getValue(value) {
                this.valueId = value;
                this.form.parent_id = value;
            },
            handleSizeChange(val) {
                let self = this;
                self.pageSize = val;
                self.getdeptListForm();
            },
            handleCurrentChange(val) {
                let self = this;
                self.currentPage = val;
                self.getdeptListForm();
            },
        },
        // 监视
        watch: {}
    };
</script>
<style scoped>
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
