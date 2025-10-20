import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // 1. Deleta as entradas existentes nas duas tabelas
  await knex("turmas").del();
  await knex("enderecos").del();

  // 2. Insere os endereços e guarda os IDs gerados
  const [endereco1Id, endereco2Id] = await knex("enderecos")
    .insert([
      {
        id: uuidv4(),
        rua: "fl 17, ",
        numero: "123",
        cidade: "São Paulo",
        estado: "SP",
      },
      {
        id: uuidv4(),
        rua: "Avenida Principal",
        numero: "456",
        cidade: "São Paulo",
        estado: "SP",
      },
    ])
    .returning("id"); // Retorna os IDs dos endereços inseridos

  // 3. Insere as turmas, referenciando os IDs dos endereços
  await knex("turmas").insert([
    {
      id: uuidv4(),
      nome: "Turma A",
      turno: "Manhã",
      horario_aula: "08:00 - 10:00",
      modalidade: "Básica",
      endereco_id: endereco1Id, // Referencia o primeiro endereço
    },
    {
      id: uuidv4(),
      nome: "Turma B",
      turno: "Tarde",
      horario_aula: "14:00 - 16:00",
      modalidade: "Intermediária",
      endereco_id: endereco2Id, // Referencia o segundo endereço
    },
    {
      id: uuidv4(),
      nome: "Turma C",
      turno: "Noite",
      horario_aula: "19:00 - 21:00",
      modalidade: "Avançada",
      endereco_id: endereco1Id, // Usa o mesmo ID para a Turma A e C
    },
  ]);
}
