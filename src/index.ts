import { Hono } from 'hono'
import { createClient } from "@supabase/supabase-js";
type Bindings = {
    SUPABASE_URL: string
    SUPABASE_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY)
    console.log(c.env.SUPABASE_URL)
    const { data: test_table, error } = await supabase.from('test_table').select('naiyou')
  
    if (error) {
      console.error(error);
      return c.json({ status: 500, statusText: 'Error fetching data', data: [] });
    }
  
    if (!test_table || test_table.length === 0 || !test_table[0].naiyou) {
      return c.json({ status: 404, statusText: 'No data found', data: [] });
    }
  
    return c.json({ status: 200, statusText: 'OK', data: test_table[0].naiyou });
  });

// auth
app.get('/auth', async (c) => {
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY)
    const { data, error } = await supabase.auth.signUp({
      email: 'example@email.com',
      password: 'example-password',
    })
    return c.json({ data, error })
  })
app.get('/auth/login', async (c) => {
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY)
    const { data: { user } } = await supabase.auth.getUser()
    return c.json({ user })
})
export default app
