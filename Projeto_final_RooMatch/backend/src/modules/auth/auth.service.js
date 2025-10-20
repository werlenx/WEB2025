import bcrypt from "bcryptjs";

export class AuthService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Encontra um usuário pelo email, incluindo o perfil para verificar permissões
  async findUserByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        house: true,
      },
    });
  }

  // Cria um novo usuário (usado no Cadastro /auth/register)
  async registerUser(name, email, password) {
    // Busca o perfil COMUM para novos cadastros
    const commonProfile = await this.prisma.profile.findUnique({
      where: { name: "COMMON" },
    });

    if (!commonProfile) {
      throw new Error("Profile 'COMMON' not found. Run DB Seed.");
    }

    // Cria o hash da senha
    const password_hash = await bcrypt.hash(password, 10);

    // Cria o usuário com status PENDING e sem house_id inicial
    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        profile_id: commonProfile.id,
        house_status: "PENDING",
        score: 0,
        star_avg: 3.0,
        // house_id é null por padrão
      },
    });

    // Retorna o novo usuário sem o hash da senha
    const { password_hash: _, ...userWithoutHash } = newUser;
    return userWithoutHash;
  }
}
