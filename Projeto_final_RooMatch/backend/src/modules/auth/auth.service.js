import bcrypt from "bcryptjs";
import crypto from "crypto";

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

  // NOVO MÉTODO: Cria um token seguro para reset de senha e o salva no DB.
  async createPasswordResetToken(email) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      // Best Practice: Retorna mensagem de sucesso para evitar que atacantes descubram emails válidos
      return {
        message:
          "If a user with that email exists, a password reset token has been generated.",
      };
    }

    // 1. Gera um token seguro (32 bytes -> 64 caracteres hexadecimais)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2. Define a expiração (Ex: 1 hora a partir de agora)
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // 3. Salva o token e a expiração no banco
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        reset_password_token: resetToken,
        reset_password_expires: resetExpires,
      },
    });

    // Retornamos o token apenas para facilitar o teste no Postman (NÃO FAÇA ISSO EM PROD)
    return {
      message: "Password reset token generated and saved.",
      resetToken,
    };
  }

  // NOVO MÉTODO: Encontra usuário pelo token, atualiza a senha e limpa os campos de token.
  async resetPassword(token, newPassword) {
    // 1. Encontra o usuário pelo token e verifica se ele não expirou
    const user = await this.prisma.user.findFirst({
      where: {
        reset_password_token: token,
        reset_password_expires: {
          gt: new Date(), // gt = greater than (garante que a data de expiração é maior que a hora atual)
        },
      },
    });

    if (!user) {
      throw new Error("Token is invalid or has expired.");
    }

    // 2. Cria o novo hash da senha
    const password_hash = await bcrypt.hash(newPassword, 10);

    // 3. Atualiza a senha e limpa os campos de token/expiração
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash,
        reset_password_token: null, // Limpa o token para evitar reuso
        reset_password_expires: null, // Limpa a expiração
      },
      select: { id: true, email: true },
    });

    return updatedUser;
  }
}
