<template>
  <div style="height: 650px;overflow: auto">
    <el-row>
      <el-col :span="24" style="text-align: center">
        <h1>菜单权限列表</h1>
      </el-col>
    </el-row>
    <el-row>


      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-form ref="form">
            <el-form-item label="请选择角色" label-width="120px">
              <el-select v-model="value" placeholder="请选择" @change="changeRole">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>


      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          <div class="block">
            <el-tree
              ref="mytree"
              :data="data"
              show-checkbox
              node-key="id"
              default-expand-all
              :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
            </el-tree>
          </div>
        </div>
      </el-col>


    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button type="primary" style="width: 100%" @click="addAuth">修改菜单权限</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  let id = 1000;
  export default {
    data() {
      return {
        data: [],
        options: [],
        value: ''
      }
    },
    mounted() {
      // 初始化角色
      this.getRoleList()
      // 初始化菜单
      this.getMenuTree()
    },
    methods: {




      append(data) {
     /*   ;*/
        this.$prompt('请输入要添加的菜单名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/^[0-9A-Za-z\u4e00-\u9fa5]{2,14}$/,
          inputErrorMessage: '只能输入中文、数字、字母 2-14个字符之间'
        }).then(({ value }) => {
          //ajax
          console.log(data)
          this.$axios.get('api/menus/addMenu?parentid='+data.id+'&content='+value,function (res) {

          })

          this.$message({
            type: 'success',
            message: '你新建的菜单是: ' + value
          });
          const newChild = {id: id++, label: value, children: []};
          if (!data.children) {
            this.$set(data, 'children', []);
          }
          data.children.push(newChild)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },





      remove(node, data) {
        this.$confirm("您确定删除嘛").then(res=>{

          this.$axios.get('api/menus/delMenu?id='+data.id).then(res=>{
            console.log(res)
                 if (res.data.status==200){
                   this.$message("删除成功")
                 }else{
                   this.$.message("删除失败")
                 }
          })

          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.id === data.id);
          children.splice(index, 1);
        })
      },








      getRoleList() {
        //ajax
        this.$axios.get("api/role/getAllRoles?pageNo=1&pageSize=500").then(res => {
          // console.log(res.data.obj.data)
          let ops = res.data.obj.data.map(role => {
            return {
              value: role.id,
              label: role.role
            }
          })
          // console.log(ops)
          this.options = ops;
        })
      },






      getMenuTree() {
        this.$axios.get("api/menus/menuTree").then(res => {
          //console.log(res.data, '在这')
          this.data = res.data;
        })
      },






      changeRole() {
        this.$axios.get("api/menus/getMenusByRoleId2?roleId=" + this.value).then(res => {


          console.log(res.data)
          // 取出ids
          let ids = res.data.obj.map(m => m.id);
          console.log(ids,'这是ids')
          // 设置checked
          this.$refs.mytree.setCheckedKeys(ids)
        })
      },






      addAuth() {
        //先删除
           /*     var obj = {id:2,role:"zhangsan"}
                this.$axios.post('api/rolemenu/delByRoleId', obj).then(res=>{
                  console.log(res)
                })*/

        this.$axios({
          method: 'get',
          url: 'api/rolemenu/delByRoleId?roleId='+this.value,
        });

        //再添加
        //获取checked key
        var ids = this.$refs.mytree.getCheckedKeys(true);
        this.$axios.get("api/rolemenu/addMore?roleId=" + this.value + "&ids=" + ids).then(res => {
          console.log(res.data)
            if (res.data.status==200) {
              this.$message({
                type: "success",
                message: "权限更新成功！"
              })
            } else {
              this.$message({
                type: "error",
                message: "权限更新失败！"
              })
            }
        })
      }
    }
  }
</script>

<style>


  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
