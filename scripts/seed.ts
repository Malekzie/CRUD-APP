import { db } from '../src/lib/server/db';
import { posts, users } from '../src/lib/server/schemas';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';
import { randCatchPhrase, randMovieCharacter, randPhrase, randTextRange } from '@ngneat/falso'

export async function createUsers() {
	for (let i = 0; i < 10; i++) {
		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash('1234');

		await db.insert(users)
			.values({ username: randMovieCharacter(), hashed_password: hashedPassword, id: userId })
			.returning({ insertedId: users.id })
		createPosts(userId);
	}
}

async function createPosts(userId: string) {
	for (let i = 0; i < 5; i++) {
		await db.insert(posts)
			.values({ 
                    title: randCatchPhrase(), 
                    content: randTextRange({ min: 10, max: 255}), 
                    userId })
	}
}

async function seed() {
	await createUsers();
}

await seed();
