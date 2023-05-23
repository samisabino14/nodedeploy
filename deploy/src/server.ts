import fastify from 'fastify';
import prismaClient from './prisma';
import { z } from 'zod';

const app = fastify();


app.get('/users', async (request, reply) => {

    const users = await prismaClient.users.findMany();

    return reply.status(200).send(users);
});

app.post('/users', async (request, reply) => {

    const createUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
    });

    const { name, email } = createUserSchema.parse(request.body);

    await prismaClient.users.create({

        data: {
            name,
            email
        }
    });

    return reply.status(201).send();
});

app.patch('/users/:id', async (req, reply) => {

    const idParam = z.object({

        id: z.string(),
    });

    const updateUserSchema = z.object({

        name: z.string(),
        email: z.string(),
    });

    const { id } = idParam.parse(req.params);

    const { name, email } = updateUserSchema.parse(req.body);

    const user = await prismaClient.users.update({

        data: {
            name,
            email
        },

        where: {
            id
        }
    });

    return reply.status(200).send(user);
});

app.delete('/users/:id', async (req, reply) => {

    const idParam = z.object({
        id: z.string(),
    });

    const { id } = idParam.parse(req.params);

    const user = await prismaClient.users.delete({

        where: {
            id
        }
    });

    return reply.status(200).send(user);
});


app.listen({

    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 5000

}).then( () => {
    
    console.log('LISTENING ON PORT ' + process.env.PORT);
})
