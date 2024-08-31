import bcrypt from "bcrypt";

export async function securePassword(password: string) {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error);
  }
}

export async function verifyPassword(password:string, Password:string){
    return bcrypt.compare(password, Password)
}