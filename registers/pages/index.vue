<template>
  <v-row>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="desserts"
        sort-by="name"
        class="elevation-0"
        no-data-text="Não existem dados para exibição"
        loading="true"
        locale=	'pt-BR'
        loading-text="Carregando itens"
        mobile-breakpoint="400"
        multi-sort
        :header-props="{
          sortByText: 'Filtro',
        }"
        :footer-props="{
          itemsPerPageText: 'Registros por página',
          showFirstLastPage: true,
          itemsPerPageOptions: [10, 20, -1],
          itemsPerPageAllText: 'Todos',
          pageText: '{0} - {1} de {2}',
          firstIcon: 'mdi-arrow-collapse-left primary--text',
          lastIcon: 'mdi-arrow-collapse-right primary--text',
          prevIcon: 'mdi-minus primary--text',
          nextIcon: 'mdi-plus primary--text',
        }"
        ><template v-slot:item.birthdate="{ item }">
          <span>{{ $moment(item.birthdate).format("L") }}</span>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title class="primary--text v-JetBrains"
              >Clientes</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  fab
                  small
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="primary--text v-JetBrains">{{ formTitle }}</span>
                </v-card-title>
                <v-divider class="primary" />
                <v-card-text>
                  <v-container>
                    <v-form ref="register">
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="register.name"
                            label="Nome"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="register.profession"
                            label="Profissão"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="register.address"
                            label="Endereço"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="register.birthdate"
                            label="Nascimento"
                            v-mask="['####-##-##']"
                            hint="Ex.: XXXX-XX-XX"
                            persistent-hint
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-divider class="primary" />
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="accent" @click="close"> Cancelar </v-btn>
                  <v-btn color="primary" @click="save"> Salvar </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="330px">
              <v-card>
                <v-card-title class="primary--text"
                  >Excluir este item?</v-card-title
                >
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="accent" @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="primary" @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2 primary--text" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small class="mr-2 secondary--text" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="secondary" @click="initialize"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-col>
    <G-Snackbar></G-Snackbar>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Nome", value: "name" },
      { text: "Profissão", value: "profession" },
      { text: "Endereço", value: "address" },
      { text: "nascimento", value: "birthdate" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    rules: {
      required: (value) => !!value || "Campo obrigatório.",
    },
    desserts: [],
    editedIndex: -1,
    register: {
      _id: "",
      name: "",
      profession: "",
      address: "",
      birthdate: "",
    },
    defaultItem: {
      _id: "",
      name: "",
      profession: "",
      address: "",
      birthdate: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo" : "Editar";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.desserts = [];
      let { data } = await this.$axios.get("/register");
      this.desserts = data.registers;
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.register = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.register = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      console.log(this.desserts[this.editedIndex]._id);

      let r = await this.$axios.delete(
        `/register/${this.desserts[this.editedIndex]._id}`
      );
      if (r.data.status === "OK") {
        this.setSnackbar({ msn: "Cadastrado com sucesso.", type: "success" });
        this.desserts.splice(this.editedIndex, 1);
      } else {
        this.setSnackbar({ msn: "Ocorreu um erro.", type: "error" });
      }

      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.register = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.register = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    setSnackbar(data) {
      this.$snackbar.showMessage({
        content: data.msn,
        color: data.type,
      });
    },

    async save() {
      if (!this.$refs.register.validate()) return;

      if (this.editedIndex > -1) {
        let r = await this.$axios.put("/register", {
          _id: this.register._id,
          name: this.register.name,
          profession: this.register.profession,
          address: this.register.address,
          birthdate: new Date(`${this.register.birthdate} 00:00:00`),
        });
        if (r.data.status === "OK") {
          this.setSnackbar({ msn: "Cadastrado com sucesso.", type: "success" });
          Object.assign(this.desserts[this.editedIndex], this.register);
        } else {
          this.setSnackbar({ msn: "Ocorreu um erro.", type: "error" });
        }
      } else {
        let r = await this.$axios.post("/register", {
          name: this.register.name,
          profession: this.register.profession,
          address: this.register.address,
          birthdate: new Date(`${this.register.birthdate} 00:00:00`),
        });
        if (r.data.status === "OK") {
          this.setSnackbar({ msn: "Cadastrado com sucesso.", type: "success" });
          this.desserts.push(this.register);
        } else {
          this.setSnackbar({ msn: "Ocorreu um erro.", type: "error" });
        }
      }
      this.close();
    },
  },
};
</script>